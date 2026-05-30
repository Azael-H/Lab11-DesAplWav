"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import type { Project } from "@/lib/store"

interface ProjectFormProps {
  onAdd: (project: Project) => void
  nextId: number
}

export function ProjectForm({ onAdd, nextId }: ProjectFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    title: "", description: "", category: "", priority: "", members: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.category || !formData.priority) {
      setError("Por favor completa todos los campos obligatorios.")
      return
    }
    setError("")
    setLoading(true)
    setTimeout(() => {
      onAdd({
        id: nextId,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        status: "Planificado",
        progress: 0,
        members: formData.members ? formData.members.split(",").map(m => m.trim()) : [],
      })
      setFormData({ title: "", description: "", category: "", priority: "", members: "" })
      setLoading(false)
      setOpen(false)
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="mr-2 h-4 w-4">
            <path d="M5 12h14" /><path d="M12 5v14" />
          </svg>
          Nuevo Proyecto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
            <DialogDescription>Completa la información del proyecto.</DialogDescription>
          </DialogHeader>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nombre del Proyecto <span className="text-red-500">*</span></Label>
              <Input placeholder="Mi Proyecto Increíble" value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Descripción</Label>
              <Input placeholder="Breve descripción..." value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Categoría <span className="text-red-500">*</span></Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger><SelectValue placeholder="Selecciona una categoría" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">Desarrollo Web</SelectItem>
                  <SelectItem value="mobile">Desarrollo Mobile</SelectItem>
                  <SelectItem value="design">Diseño</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Prioridad <span className="text-red-500">*</span></Label>
              <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                <SelectTrigger><SelectValue placeholder="Selecciona la prioridad" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Miembros del equipo</Label>
              <Input placeholder="María García, Juan Pérez (separados por coma)"
                value={formData.members}
                onChange={(e) => setFormData({ ...formData, members: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading}>
              {loading ? <><Spinner size="sm" className="mr-2" />Creando...</> : "Crear Proyecto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
