"use client"
import { useState } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import type { Task } from "@/lib/store"

const statusVariant = (s: string) =>
  s === "Completado" ? "default" : s === "En progreso" ? "secondary" : "outline"
const priorityVariant = (p: string) =>
  p === "Urgente" ? "destructive" : p === "Alta" ? "default" : p === "Media" ? "secondary" : "outline"

const PAGE_SIZE = 4
const emptyForm = { description: "", projectId: "", status: "Pendiente", priority: "Media", userId: "", dateline: "" }

interface TasksTableProps {
  tasks: Task[]
  onAdd: (t: Task) => void
  onUpdate: (t: Task) => void
  onDelete: (id: number) => void
  nextId: number
}

export function TasksTable({ tasks, onAdd, onUpdate, onDelete, nextId }: TasksTableProps) {
  const [page, setPage] = useState(1)
  const [openDialog, setOpenDialog] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const totalPages = Math.ceil(tasks.length / PAGE_SIZE)
  const paginated = tasks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const openAdd = () => { setEditing(null); setForm({ ...emptyForm }); setError(""); setOpenDialog(true) }
  const openEdit = (t: Task) => { setEditing(t); setForm({ description: t.description, projectId: t.projectId, status: t.status, priority: t.priority, userId: t.userId, dateline: t.dateline }); setError(""); setOpenDialog(true) }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.description || !form.projectId || !form.userId) {
      setError("Descripción, proyecto y responsable son obligatorios.")
      return
    }
    setError("")
    setLoading(true)
    setTimeout(() => {
      editing ? onUpdate({ ...editing, ...form }) : onAdd({ id: nextId, ...form })
      setLoading(false)
      setOpenDialog(false)
    }, 800)
  }

  return (
    <div>
      <div className="flex justify-end mb-3">
        <Button size="sm" onClick={openAdd}>+ Nueva Tarea</Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableCaption>Lista de tareas — Página {page} de {totalPages}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"><Checkbox /></TableHead>
              <TableHead>Tarea</TableHead>
              <TableHead>Proyecto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Responsable</TableHead>
              <TableHead>Fecha límite</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((task) => (
              <TableRow key={task.id}>
                <TableCell><Checkbox /></TableCell>
                <TableCell className="font-medium">{task.description}</TableCell>
                <TableCell>{task.projectId}</TableCell>
                <TableCell><Badge variant={statusVariant(task.status)}>{task.status}</Badge></TableCell>
                <TableCell><Badge variant={priorityVariant(task.priority)}>{task.priority}</Badge></TableCell>
                <TableCell>{task.userId}</TableCell>
                <TableCell>{task.dateline}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(task)}>Editar</Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => onDelete(task.id)}>Eliminar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem><PaginationPrevious onClick={() => setPage(p => Math.max(1, p - 1))} /></PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink isActive={page === i + 1} onClick={() => setPage(i + 1)}>{i + 1}</PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem><PaginationNext onClick={() => setPage(p => Math.min(totalPages, p + 1))} /></PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editing ? "Editar Tarea" : "Nueva Tarea"}</DialogTitle>
              <DialogDescription>Completa los campos de la tarea.</DialogDescription>
            </DialogHeader>
            {error && <Alert variant="destructive" className="mt-3"><AlertDescription>{error}</AlertDescription></Alert>}
            <div className="grid gap-3 py-4">
              <div className="grid gap-1">
                <Label>Descripción *</Label>
                <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Descripción de la tarea" />
              </div>
              <div className="grid gap-1">
                <Label>Proyecto *</Label>
                <Input value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })} placeholder="Nombre del proyecto" />
              </div>
              <div className="grid gap-1">
                <Label>Estado</Label>
                <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="En progreso">En progreso</SelectItem>
                    <SelectItem value="Completado">Completado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1">
                <Label>Prioridad</Label>
                <Select value={form.priority} onValueChange={v => setForm({ ...form, priority: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Baja">Baja</SelectItem>
                    <SelectItem value="Media">Media</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1">
                <Label>Responsable *</Label>
                <Input value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })} placeholder="Nombre del responsable" />
              </div>
              <div className="grid gap-1">
                <Label>Fecha límite</Label>
                <Input type="date" value={form.dateline} onChange={e => setForm({ ...form, dateline: e.target.value })} />
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
