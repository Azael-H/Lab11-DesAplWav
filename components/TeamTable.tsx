"use client"
import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import type { TeamMember } from "@/lib/store"

interface TeamTableProps {
  members: TeamMember[]
  onAdd: (m: TeamMember) => void
  onUpdate: (m: TeamMember) => void
  onDelete: (userId: string) => void
  nextUserId: string
}

const emptyForm: Omit<TeamMember, "isActive"> & { isActive: boolean } = {
  userId: "", role: "", name: "", email: "", position: "",
  birthdate: "", phone: "", projectId: "", isActive: true,
}

export function TeamTable({ members, onAdd, onUpdate, onDelete, nextUserId }: TeamTableProps) {
  const [openDialog, setOpenDialog] = useState(false)
  const [editing, setEditing] = useState<TeamMember | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const openAdd = () => {
    setEditing(null)
    setForm({ ...emptyForm, userId: nextUserId })
    setError("")
    setOpenDialog(true)
  }

  const openEdit = (m: TeamMember) => {
    setEditing(m)
    setForm({ ...m })
    setError("")
    setOpenDialog(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.role) {
      setError("Nombre, email y rol son obligatorios.")
      return
    }
    setError("")
    setLoading(true)
    setTimeout(() => {
      if (editing) {
        onUpdate({ ...form })
      } else {
        onAdd({ ...form })
      }
      setLoading(false)
      setOpenDialog(false)
    }, 800)
  }

  return (
    <div>
      <div className="flex justify-end mb-3">
        <Button size="sm" onClick={openAdd}>+ Nuevo Miembro</Button>
      </div>
      <div className="space-y-3">
        {members.map((member) => (
          <div key={member.userId} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.position}</p>
                <p className="text-xs text-muted-foreground">{member.email} · {member.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={member.isActive ? "default" : "secondary"}>
                {member.isActive ? "Activo" : "Ausente"}
              </Badge>
              <Button size="sm" variant="outline" onClick={() => openEdit(member)}>Editar</Button>
              <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700"
                onClick={() => onDelete(member.userId)}>Eliminar</Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editing ? "Editar Miembro" : "Nuevo Miembro"}</DialogTitle>
              <DialogDescription>Completa la información del miembro del equipo.</DialogDescription>
            </DialogHeader>
            {error && <Alert variant="destructive" className="mt-3"><AlertDescription>{error}</AlertDescription></Alert>}
            <div className="grid gap-3 py-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label>Nombre *</Label>
                  <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="grid gap-1">
                  <Label>Email *</Label>
                  <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label>Rol *</Label>
                  <Select value={form.role} onValueChange={v => setForm({ ...form, role: v })}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar rol" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="designer">Designer</SelectItem>
                      <SelectItem value="devops">DevOps</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="qa">QA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1">
                  <Label>Cargo / Posición</Label>
                  <Input value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label>Fecha de nacimiento</Label>
                  <Input type="date" value={form.birthdate} onChange={e => setForm({ ...form, birthdate: e.target.value })} />
                </div>
                <div className="grid gap-1">
                  <Label>Teléfono</Label>
                  <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div className="grid gap-1">
                <Label>ID de Proyecto</Label>
                <Input value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })} placeholder="ID del proyecto asignado" />
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={form.isActive} onCheckedChange={v => setForm({ ...form, isActive: v })} />
                <Label>Miembro activo</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>Cancelar</Button>
              <Button type="submit" disabled={loading}>
                {loading ? <><Spinner size="sm" className="mr-2" />{editing ? "Guardando..." : "Creando..."}</> : editing ? "Guardar" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
