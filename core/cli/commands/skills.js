import { existsSync, readFileSync, readdirSync } from 'fs'
import { createRequire } from 'module'
import { dirname, join } from 'path'

const require = createRequire(import.meta.url)

export const name = 'skills'
export const description = 'List StartupJS agent skills installed from @startupjs/skills'

export async function action () {
  const skillsRoot = dirname(require.resolve('@startupjs/skills/package.json'))
  const skills = getSkills(skillsRoot)

  console.log('skills:')
  for (const skill of skills) {
    console.log(`  - name: ${toYamlString(skill.name)}`)
    console.log(`    description: ${toYamlString(skill.description)}`)
    console.log(`    path: ${toYamlString(skill.path)}`)
  }
}

function getSkills (skillsRoot) {
  const skills = []
  for (const entry of readdirSync(skillsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const skillPath = join(skillsRoot, entry.name, 'SKILL.md')
    if (!existsSync(skillPath)) continue
    const metadata = getSkillMetadata(skillPath)
    skills.push({
      name: metadata.name || entry.name,
      description: metadata.description || '',
      path: skillPath
    })
  }
  return skills.sort((a, b) => a.name.localeCompare(b.name))
}

function getSkillMetadata (skillPath) {
  const content = readFileSync(skillPath, 'utf8')
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}

  const metadata = {}
  for (const line of match[1].split('\n')) {
    const field = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!field) continue
    metadata[field[1]] = unquoteYamlString(field[2])
  }
  return metadata
}

function unquoteYamlString (value) {
  value = value.trim()
  if (!value) return ''
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1)
  }
  return value
}

function toYamlString (value) {
  return JSON.stringify(value)
}
