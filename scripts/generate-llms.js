#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'

const DEFAULT_CONFIG = {
  title: '',
  summary: '',
  include: ['README.md', 'docs/**/*.md', 'docs/**/*.mdx'],
  exclude: [
    '.git/**',
    '.github/**',
    '.expo/**',
    '.next/**',
    '.yarn/**',
    'coverage/**',
    'build/**',
    'dist/**',
    'node_modules/**',
    'vendor/**',
    'temp/**'
  ],
  sectionOrder: ['Core Docs', 'Documentation'],
  output: {
    index: 'llms.txt',
    full: 'llms-full.txt'
  },
  patternOverrides: {},
  overrides: {}
}

const rootDir = process.cwd()
const args = parseArgs(process.argv.slice(2))
const configPath = path.resolve(rootDir, args.config ?? 'llms.config.json')
const config = await loadConfig(configPath)

const markdownFiles = await collectMarkdownFiles(rootDir, config.exclude)
const docs = []

for (const relativePath of markdownFiles) {
  if (relativePath === config.output.index || relativePath === config.output.full) continue
  if (!shouldInclude(relativePath, config.include, config.exclude)) continue

  const absolutePath = path.join(rootDir, relativePath)
  const rawContent = await fs.readFile(absolutePath, 'utf8')
  const fileInfo = buildFileInfo(relativePath, rawContent, config)

  if (!fileInfo.includeInIndex && !fileInfo.includeInFull) continue
  docs.push(fileInfo)
}

docs.sort((left, right) => {
  const sectionCompare = compareSection(config.sectionOrder, left.section, right.section)
  if (sectionCompare !== 0) return sectionCompare
  if (left.order !== right.order) return left.order - right.order
  return left.path.localeCompare(right.path)
})

const title = args.title ?? config.title ?? detectTitle(docs)
const summary = args.summary ?? config.summary ?? ''

const llmsIndex = renderIndex({ title, summary, docs })
const llmsFull = renderFull({ title, summary, docs })

if (args.dryRun) {
  process.stdout.write(`${llmsIndex}\n\n${'-'.repeat(80)}\n\n${llmsFull}\n`)
  process.exit(0)
}

await fs.writeFile(path.join(rootDir, config.output.index), llmsIndex)
await fs.writeFile(path.join(rootDir, config.output.full), llmsFull)

process.stdout.write(
  `Generated ${config.output.index} and ${config.output.full} from ${docs.length} documents.\n`
)

function parseArgs (argv) {
  const parsed = { dryRun: false }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]

    if (arg === '--dry-run') {
      parsed.dryRun = true
      continue
    }

    if (arg === '--config') {
      parsed.config = argv[++i]
      continue
    }

    if (arg === '--title') {
      parsed.title = argv[++i]
      continue
    }

    if (arg === '--summary') {
      parsed.summary = argv[++i]
      continue
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return parsed
}

async function loadConfig (configPath) {
  try {
    const rawConfig = await fs.readFile(configPath, 'utf8')
    const parsedConfig = JSON.parse(rawConfig)
    return mergeConfig(DEFAULT_CONFIG, parsedConfig)
  } catch (error) {
    if (error.code === 'ENOENT') return structuredClone(DEFAULT_CONFIG)
    throw error
  }
}

function mergeConfig (baseConfig, fileConfig) {
  return {
    ...baseConfig,
    ...fileConfig,
    include: fileConfig.include ?? baseConfig.include,
    exclude: fileConfig.exclude ?? baseConfig.exclude,
    sectionOrder: fileConfig.sectionOrder ?? baseConfig.sectionOrder,
    output: {
      ...baseConfig.output,
      ...(fileConfig.output ?? {})
    },
    patternOverrides: fileConfig.patternOverrides ?? baseConfig.patternOverrides,
    overrides: fileConfig.overrides ?? baseConfig.overrides
  }
}

async function collectMarkdownFiles (directory, excludePatterns) {
  const items = await fs.readdir(directory, { withFileTypes: true })
  const files = []

  for (const item of items) {
    const absolutePath = path.join(directory, item.name)
    const relativePath = toPosix(path.relative(rootDir, absolutePath))

    if (item.isDirectory()) {
      if (shouldSkipDirectory(relativePath, excludePatterns)) continue
      files.push(...await collectMarkdownFiles(absolutePath, excludePatterns))
      continue
    }

    if (isMarkdownFile(relativePath)) files.push(relativePath)
  }

  return files
}

function shouldSkipDirectory (relativePath, excludePatterns) {
  return excludePatterns.some(pattern => {
    if (path.matchesGlob(relativePath, pattern)) return true
    return path.matchesGlob(`${relativePath}/__dir__`, pattern)
  })
}

function isMarkdownFile (relativePath) {
  return relativePath.endsWith('.md') || relativePath.endsWith('.mdx')
}

function shouldInclude (relativePath, includePatterns, excludePatterns) {
  const included = includePatterns.length === 0
    ? true
    : includePatterns.some(pattern => path.matchesGlob(relativePath, pattern))

  if (!included) return false

  return !excludePatterns.some(pattern => path.matchesGlob(relativePath, pattern))
}

function buildFileInfo (relativePath, rawContent, config) {
  const { frontmatter, body } = splitFrontmatter(rawContent)
  const override = {
    ...getPatternOverride(relativePath, config.patternOverrides),
    ...(config.overrides?.[relativePath] ?? {})
  }
  const title = override.title || frontmatter.title || extractHeading(body) || humanizeFilename(relativePath)
  const summary = override.summary || frontmatter.description || frontmatter.summary || extractSummary(body)
  const section = override.section || frontmatter.llmsGroup || frontmatter.section || inferSection(relativePath)
  const order = Number(override.order ?? frontmatter.order ?? Number.MAX_SAFE_INTEGER)
  const includeInIndex = override.includeInIndex ?? frontmatter.llmsIndex ?? true
  const includeInFull = override.includeInFull ?? frontmatter.llmsFull ?? true

  return {
    path: relativePath,
    title: cleanInlineText(title),
    summary: cleanInlineText(summary || ''),
    section: cleanInlineText(section),
    order,
    includeInIndex: toBoolean(includeInIndex, true),
    includeInFull: toBoolean(includeInFull, true),
    fullContent: stripLeadingMdxImports(body).trim()
  }
}

function getPatternOverride (relativePath, patternOverrides = {}) {
  const mergedOverride = {}

  for (const [pattern, override] of Object.entries(patternOverrides)) {
    if (!path.matchesGlob(relativePath, pattern)) continue
    Object.assign(mergedOverride, override)
  }

  return mergedOverride
}

function splitFrontmatter (rawContent) {
  const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)

  if (!match) {
    return { frontmatter: {}, body: rawContent }
  }

  const frontmatterBlock = match[1]
  const body = rawContent.slice(match[0].length)
  const frontmatter = {}

  for (const line of frontmatterBlock.split('\n')) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.+)\s*$/)
    if (!match) continue

    const key = match[1]
    const value = parseFrontmatterValue(match[2])
    frontmatter[key] = value
  }

  return { frontmatter, body }
}

function parseFrontmatterValue (value) {
  const normalizedValue = value.trim()

  if ((normalizedValue.startsWith('"') && normalizedValue.endsWith('"')) ||
      (normalizedValue.startsWith('\'') && normalizedValue.endsWith('\''))) {
    return normalizedValue.slice(1, -1)
  }

  if (normalizedValue === 'true') return true
  if (normalizedValue === 'false') return false
  if (/^-?\d+(\.\d+)?$/.test(normalizedValue)) return Number(normalizedValue)

  return normalizedValue
}

function extractHeading (body) {
  for (const line of body.split('\n')) {
    const trimmedLine = line.trim()
    if (!trimmedLine) continue
    if (trimmedLine.startsWith('import ') || trimmedLine.startsWith('export ')) continue
    if (/^#\s+/.test(trimmedLine)) return trimmedLine.replace(/^#\s+/, '').trim()
  }
}

function extractSummary (body) {
  const lines = stripLeadingMdxImports(body).split('\n')
  const collected = []
  let inCodeFence = false

  for (const line of lines) {
    const trimmedLine = line.trim()

    if (trimmedLine.startsWith('```')) {
      inCodeFence = !inCodeFence
      continue
    }

    if (inCodeFence) continue
    if (!trimmedLine) {
      if (collected.length > 0) break
      continue
    }
    if (trimmedLine.startsWith('#')) continue
    if (trimmedLine.startsWith('>')) continue
    if (trimmedLine.startsWith('import ') || trimmedLine.startsWith('export ')) continue
    if (trimmedLine.startsWith('<') && trimmedLine.endsWith('>')) continue

    collected.push(trimmedLine)
  }

  return collected.join(' ')
}

function stripLeadingMdxImports (body) {
  const lines = body.split('\n')
  let index = 0

  while (index < lines.length) {
    const trimmedLine = lines[index].trim()
    if (!trimmedLine) {
      index++
      continue
    }

    if (trimmedLine.startsWith('import ') || trimmedLine.startsWith('export ')) {
      index++
      continue
    }

    break
  }

  return lines.slice(index).join('\n')
}

function inferSection (relativePath) {
  const segments = relativePath.split('/')

  if (segments.length === 1) return 'Core Docs'

  if (segments[0] === 'docs') {
    if (segments.length >= 3) return humanizeSegment(segments[1])
    return 'Documentation'
  }

  return humanizeSegment(segments[0])
}

function renderIndex ({ title, summary, docs }) {
  const lines = [`# ${title}`]

  if (summary) {
    lines.push('', `> ${summary}`)
  }

  for (const [sectionName, sectionDocs] of groupBySection(docs)) {
    const visibleDocs = sectionDocs.filter(doc => doc.includeInIndex)
    if (visibleDocs.length === 0) continue

    lines.push('', `## ${sectionName}`, '')

    for (const doc of visibleDocs) {
      const docSummary = doc.summary || `Documentation at ${doc.path}.`
      lines.push(`- [${doc.title}](./${doc.path}): ${docSummary}`)
    }
  }

  return `${lines.join('\n').trim()}\n`
}

function renderFull ({ title, summary, docs }) {
  const lines = [`# ${title}`]

  if (summary) {
    lines.push('', `> ${summary}`)
  }

  lines.push('', '## Included Documents', '')

  for (const doc of docs) {
    if (!doc.includeInFull) continue
    const docSummary = doc.summary || `Documentation at ${doc.path}.`
    lines.push(`- [${doc.title}](./${doc.path}): ${docSummary}`)
  }

  const fullDocs = docs.filter(doc => doc.includeInFull)

  for (const doc of fullDocs) {
    lines.push('', '---', '', `## ${doc.title}`, '', `Source: \`./${doc.path}\``, '')
    lines.push(doc.fullContent || '_No content extracted._')
  }

  return `${lines.join('\n').trim()}\n`
}

function groupBySection (docs) {
  const groups = new Map()

  for (const doc of docs) {
    if (!groups.has(doc.section)) groups.set(doc.section, [])
    groups.get(doc.section).push(doc)
  }

  return groups
}

function compareSection (sectionOrder, leftSection, rightSection) {
  const leftIndex = orderedSectionIndex(sectionOrder, leftSection)
  const rightIndex = orderedSectionIndex(sectionOrder, rightSection)

  if (leftIndex !== rightIndex) return leftIndex - rightIndex
  return leftSection.localeCompare(rightSection)
}

function orderedSectionIndex (sectionOrder, sectionName) {
  const index = sectionOrder.indexOf(sectionName)
  return index === -1 ? Number.MAX_SAFE_INTEGER : index
}

function detectTitle (docs) {
  const readme = docs.find(doc => doc.path === 'README.md')
  if (readme) return readme.title
  return humanizeSegment(path.basename(rootDir))
}

function cleanInlineText (value) {
  return String(value)
    .replace(/`/g, '')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

function humanizeFilename (relativePath) {
  const basename = path.basename(relativePath, path.extname(relativePath))
  if (/^readme$/i.test(basename)) {
    const parentDir = path.dirname(relativePath)
    if (parentDir === '.') return 'README'
    return `${humanizeSegment(path.basename(parentDir))} README`
  }

  return humanizeSegment(basename)
}

function humanizeSegment (value) {
  return value
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, match => match.toUpperCase())
}

function toBoolean (value, fallback) {
  if (typeof value === 'boolean') return value
  return fallback
}

function toPosix (relativePath) {
  return relativePath.split(path.sep).join(path.posix.sep)
}
