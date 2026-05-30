"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { ProjectForm } from "@/components/ProjectForm"
import { TasksTable } from "@/components/TaskTable"
import { TeamTable } from "@/components/TeamTable"
import { initialProjects, initialTeam, initialTasks } from "@/lib/store"
import type { Project, TeamMember, Task } from "@/lib/store"

const recentActivity = [
  { user: "María García", action: "completó la tarea", task: "Diseño de UI", time: "Hace 5 min" },
  { user: "Juan Pérez", action: "comentó en", task: "API Backend", time: "Hace 1 hora" },
  { user: "Ana López", action: "creó un nuevo", task: "Proyecto Mobile", time: "Hace 2 horas" },
  { user: "Carlos Ruiz", action: "actualizó", task: "Documentación", time: "Hace 3 horas" },
]

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [team, setTeam] = useState<TeamMember[]>(initialTeam)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [settingsSaved, setSettingsSaved] = useState(false)
  const [settingsLoading, setSettingsLoading] = useState(false)
  const [settings, setSettings] = useState({
    notifications: true, darkMode: false, autoSave: true, projectName: "Mi Dashboard",
  })

  // Métricas dinámicas
  const completedProjects = projects.filter(p => p.status === "Completado").length
  const completedTasks = tasks.filter(t => t.status === "Completado").length
  const activeMembers = team.filter(m => m.isActive).length

  // Projects CRUD
  const addProject = (p: Project) => setProjects(prev => [...prev, p])
  const deleteProject = (id: number) => setProjects(prev => prev.filter(p => p.id !== id))
  const updateProject = (p: Project) => setProjects(prev => prev.map(x => x.id === p.id ? p : x))

  // Team CRUD
  const addMember = (m: TeamMember) => setTeam(prev => [...prev, m])
  const updateMember = (m: TeamMember) => setTeam(prev => prev.map(x => x.userId === m.userId ? m : x))
  const deleteMember = (userId: string) => setTeam(prev => prev.filter(m => m.userId !== userId))

  // Tasks CRUD
  const addTask = (t: Task) => setTasks(prev => [...prev, t])
  const updateTask = (t: Task) => setTasks(prev => prev.map(x => x.id === t.id ? t : x))
  const deleteTask = (id: number) => setTasks(prev => prev.filter(t => t.id !== id))

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    setSettingsLoading(true)
    setTimeout(() => {
      setSettingsLoading(false)
      setSettingsSaved(true)
      setTimeout(() => setSettingsSaved(false), 3000)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard de Proyectos</h1>
          <p className="text-slate-600">Gestiona tus proyectos y tareas con shadcn/ui</p>
          <div className="pt-4">
            <ProjectForm onAdd={addProject} nextId={projects.length + 1} />
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="projects">Proyectos</TabsTrigger>
            <TabsTrigger value="team">Equipo</TabsTrigger>
            <TabsTrigger value="tasks">Tareas</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          {/* ── RESUMEN ── */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Total Proyectos", value: projects.length, sub: `${completedProjects} completados` },
                { label: "Tareas Completadas", value: completedTasks, sub: `de ${tasks.length} totales` },
                { label: "Horas Trabajadas", value: "324h", sub: "+12h desde ayer" },
                { label: "Miembros Activos", value: activeMembers, sub: `de ${team.length} miembros` },
              ].map((stat) => (
                <Card key={stat.label}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.sub}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                  <CardDescription>Últimas actualizaciones de tus proyectos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((a, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Avatar><AvatarFallback>{a.user[0]}</AvatarFallback></Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{a.user}</p>
                          <p className="text-sm text-muted-foreground">{a.action} <span className="font-medium">{a.task}</span></p>
                        </div>
                        <div className="text-sm text-muted-foreground">{a.time}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Calendario</CardTitle>
                  <CardDescription>Selecciona una fecha para tus eventos</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Calendar selected={selectedDate} onSelect={setSelectedDate} mode="single" />
                </CardContent>
                {selectedDate && (
                  <CardContent className="pt-0">
                    <Alert variant="success">
                      <AlertTitle>Fecha seleccionada</AlertTitle>
                      <AlertDescription>
                        {selectedDate.toLocaleDateString("es-PE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* ── PROYECTOS ── */}
          <TabsContent value="projects" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </div>
                      <Badge variant={project.status === "Completado" ? "default" : project.status === "En revisión" ? "secondary" : "outline"}>
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Progreso</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                          <div className="h-full bg-primary transition-all" style={{ width: `${project.progress}%` }} />
                        </div>
                      </div>
                      {project.members.length > 0 && (
                        <p className="text-xs text-muted-foreground">👥 {project.members.join(", ")}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">{project.priority}</Badge>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => {
                            const newProgress = Math.min(100, project.progress + 10)
                            updateProject({ ...project, progress: newProgress, status: newProgress === 100 ? "Completado" : project.status })
                          }}>Ver detalles</Button>
                          <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700"
                            onClick={() => deleteProject(project.id)}>Eliminar</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ── EQUIPO ── */}
          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Miembros del Equipo</CardTitle>
                <CardDescription>Gestiona los miembros de tu equipo y sus roles</CardDescription>
              </CardHeader>
              <CardContent>
                <TeamTable
                  members={team}
                  onAdd={addMember}
                  onUpdate={updateMember}
                  onDelete={deleteMember}
                  nextUserId={`u${team.length + 1}`}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── TAREAS ── */}
          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Tareas</CardTitle>
                <CardDescription>Administra todas las tareas de tus proyectos</CardDescription>
              </CardHeader>
              <CardContent>
                <TasksTable
                  tasks={tasks}
                  onAdd={addTask}
                  onUpdate={updateTask}
                  onDelete={deleteTask}
                  nextId={tasks.length + 1}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── CONFIGURACIÓN ── */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configuración</CardTitle>
                <CardDescription>Administra las preferencias de tu cuenta</CardDescription>
              </CardHeader>
              <CardContent>
                {settingsSaved && (
                  <Alert variant="success" className="mb-4">
                    <AlertTitle>¡Guardado!</AlertTitle>
                    <AlertDescription>La configuración se guardó correctamente.</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleSaveSettings} className="space-y-6 max-w-md">
                  <div className="grid gap-2">
                    <Label>Nombre del proyecto</Label>
                    <Input value={settings.projectName}
                      onChange={e => setSettings({ ...settings, projectName: e.target.value })} />
                  </div>
                  <div className="space-y-3">
                    {[
                      { key: "notifications", label: "Notificaciones", desc: "Recibe alertas de actividad" },
                      { key: "darkMode", label: "Modo oscuro", desc: "Cambia el tema de la aplicación" },
                      { key: "autoSave", label: "Guardado automático", desc: "Guarda cambios automáticamente" },
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{label}</p>
                          <p className="text-xs text-muted-foreground">{desc}</p>
                        </div>
                        <Switch
                          checked={settings[key as keyof typeof settings] as boolean}
                          onCheckedChange={v => setSettings({ ...settings, [key]: v })}
                        />
                      </div>
                    ))}
                  </div>
                  <Button type="submit" disabled={settingsLoading}>
                    {settingsLoading ? <><Spinner size="sm" className="mr-2" />Guardando...</> : "Guardar Configuración"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
