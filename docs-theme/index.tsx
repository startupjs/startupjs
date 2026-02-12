import { Layout as DefaultLayout } from '@rspress/core/theme-original'
import './index.css'

export * from '@rspress/core/theme-original'

// --- Layout ---

export function Layout () {
  return (
    <div className="project-layout">
      <ProjectSidebar activeProject="startupjs" />
      <div className="project-layout-content">
        <DefaultLayout />
      </div>
    </div>
  )
}

// --- ProjectSidebar ---

interface Project {
  id: string
  name: string
  label: React.ReactNode
  url: string
}

const PROJECTS: Project[] = [
  {
    id: 'startupjs',
    name: 'StartupJS fullstack framework',
    label: 'SJS',
    url: 'https://startupjs-ui.dev.dmapper.co'
  },
  {
    id: 'cssx',
    name: 'CSSX styling',
    label: 'CSSX',
    url: 'https://cssx.dev'
  },
  {
    id: 'teamplay',
    name: 'TeamPlay ORM',
    label: 'TP',
    url: 'https://teamplay.dev'
  },
  {
    id: 'ui',
    name: 'StartupJS UI Library',
    label: 'UI',
    url: 'https://ui.startupjs.org'
  }
]

interface ProjectSidebarProps {
  activeProject: 'startupjs' | 'cssx' | 'teamplay' | 'ui'
}

function ProjectSidebar ({ activeProject }: ProjectSidebarProps) {
  return (
    <nav className="project-sidebar">
      {PROJECTS.map((project) => (
        <a
          key={project.id}
          href={project.url}
          className={`project-sidebar-button project-sidebar-button--${project.id} ${project.id === activeProject ? 'active' : ''}`}
          aria-label={project.name}
        >
          <span className="project-sidebar-button__text">{project.label}</span>
          <span className="project-sidebar-button__tooltip">{project.name}</span>
        </a>
      ))}
    </nav>
  )
}
