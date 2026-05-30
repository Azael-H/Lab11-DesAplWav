declare module 'lucide-react' {
  import * as React from 'react'
  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string
    absoluteStrokeWidth?: boolean
  }
  export type LucideIcon = React.FC<LucideProps>
  export const Check: LucideIcon
  export const ChevronDown: LucideIcon
  export const ChevronUp: LucideIcon
  export const ChevronLeft: LucideIcon
  export const ChevronRight: LucideIcon
  export const MoreHorizontal: LucideIcon
  export const X: LucideIcon
  export const Plus: LucideIcon
  export const Trash2: LucideIcon
  export const Pencil: LucideIcon
  export const AlertCircle: LucideIcon
  export const CheckCircle: LucideIcon
  export const Info: LucideIcon
}
