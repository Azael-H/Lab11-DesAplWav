// In-memory store for Dashboard data

export interface Project {
  id: number
  title: string
  description: string
  category: string
  priority: string
  status: string
  progress: number
  members: string[]
}

export interface TeamMember {
  userId: string
  role: string
  name: string
  email: string
  position: string
  birthdate: string
  phone: string
  projectId: string
  isActive: boolean
}

export interface Task {
  id: number
  description: string
  projectId: string
  status: string
  priority: string
  userId: string
  dateline: string
}

export const initialProjects: Project[] = [
  { id: 1, title: "E-commerce Platform", description: "Plataforma de comercio electrónico con Next.js", category: "web", priority: "high", status: "En progreso", progress: 65, members: ["María García", "Juan Pérez"] },
  { id: 2, title: "Mobile App", description: "Aplicación móvil con React Native", category: "mobile", priority: "medium", status: "En revisión", progress: 90, members: ["Ana López"] },
  { id: 3, title: "Dashboard Analytics", description: "Panel de análisis con visualizaciones", category: "web", priority: "low", status: "Planificado", progress: 20, members: ["Carlos Ruiz", "Laura Martínez"] },
  { id: 4, title: "API Gateway", description: "Microservicios con Node.js", category: "web", priority: "high", status: "En progreso", progress: 45, members: ["Juan Pérez", "Carlos Ruiz"] },
  { id: 5, title: "Design System", description: "Librería de componentes reutilizables", category: "design", priority: "medium", status: "Completado", progress: 100, members: ["María García"] },
  { id: 6, title: "Marketing Website", description: "Sitio web institucional", category: "marketing", priority: "medium", status: "En progreso", progress: 75, members: ["Laura Martínez"] },
]

export const initialTeam: TeamMember[] = [
  { userId: "u1", role: "developer", name: "María García", email: "maria@example.com", position: "Frontend Developer", birthdate: "1995-03-12", phone: "555-1001", projectId: "1", isActive: true },
  { userId: "u2", role: "developer", name: "Juan Pérez", email: "juan@example.com", position: "Backend Developer", birthdate: "1993-07-25", phone: "555-1002", projectId: "4", isActive: true },
  { userId: "u3", role: "designer", name: "Ana López", email: "ana@example.com", position: "UI/UX Designer", birthdate: "1997-11-08", phone: "555-1003", projectId: "2", isActive: false },
  { userId: "u4", role: "devops", name: "Carlos Ruiz", email: "carlos@example.com", position: "DevOps Engineer", birthdate: "1990-05-30", phone: "555-1004", projectId: "3", isActive: true },
  { userId: "u5", role: "manager", name: "Laura Martínez", email: "laura@example.com", position: "Project Manager", birthdate: "1988-09-14", phone: "555-1005", projectId: "6", isActive: true },
]

export const initialTasks: Task[] = [
  { id: 1, description: "Implementar autenticación", projectId: "1", status: "En progreso", priority: "Alta", userId: "u1", dateline: "2025-11-15" },
  { id: 2, description: "Diseñar pantalla de perfil", projectId: "2", status: "Pendiente", priority: "Media", userId: "u3", dateline: "2025-11-20" },
  { id: 3, description: "Configurar CI/CD", projectId: "4", status: "Completado", priority: "Alta", userId: "u4", dateline: "2025-11-10" },
  { id: 4, description: "Optimizar queries SQL", projectId: "1", status: "En progreso", priority: "Urgente", userId: "u2", dateline: "2025-11-12" },
  { id: 5, description: "Documentar API endpoints", projectId: "4", status: "Pendiente", priority: "Baja", userId: "u5", dateline: "2025-11-25" },
  { id: 6, description: "Crear componentes base", projectId: "5", status: "Completado", priority: "Media", userId: "u1", dateline: "2025-10-30" },
  { id: 7, description: "Pruebas de integración", projectId: "2", status: "Pendiente", priority: "Alta", userId: "u2", dateline: "2025-11-28" },
  { id: 8, description: "Configurar monitoreo", projectId: "4", status: "En progreso", priority: "Media", userId: "u4", dateline: "2025-12-01" },
]
