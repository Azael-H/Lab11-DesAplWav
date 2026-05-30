"use client"
import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface CalendarProps {
  className?: string
  selected?: Date
  onSelect?: (date: Date) => void
  mode?: "single"
}

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
const MONTHS = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
]

function Calendar({ className, selected, onSelect }: CalendarProps) {
  const today = new Date()
  const [viewDate, setViewDate] = React.useState(selected ?? today)

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const isSameDay = (d: number) =>
    selected &&
    selected.getFullYear() === year &&
    selected.getMonth() === month &&
    selected.getDate() === d

  const isToday = (d: number) =>
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === d

  return (
    <div className={cn("p-3 select-none", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className={cn(buttonVariants({ variant: "outline", size: "icon" }), "h-7 w-7")}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium">
          {MONTHS[month]} {year}
        </span>
        <button
          onClick={nextMonth}
          className={cn(buttonVariants({ variant: "outline", size: "icon" }), "h-7 w-7")}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      {/* Day names */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs text-muted-foreground py-1">
            {d}
          </div>
        ))}
      </div>
      {/* Cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => (
          <div key={i} className="flex items-center justify-center">
            {day ? (
              <button
                onClick={() => onSelect?.(new Date(year, month, day))}
                className={cn(
                  "h-8 w-8 rounded-full text-sm flex items-center justify-center transition-colors",
                  isSameDay(day)
                    ? "bg-primary text-primary-foreground font-semibold"
                    : isToday(day)
                    ? "border border-primary text-primary font-semibold"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {day}
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

Calendar.displayName = "Calendar"
export { Calendar }
