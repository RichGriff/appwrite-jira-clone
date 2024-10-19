import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

import { TaskStatus } from "@/features/tasks/types"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        [TaskStatus.TODO]: 
          'border-slate-600 bg-slate-100 text-slate-600 hover:bg-slate-200/80',
        [TaskStatus.IN_PROGRESS]: 
          'border-yellow-600 bg-yellow-100 text-yellow-600 hover:bg-yellow-200/80',
        [TaskStatus.IN_REVIEW]: 
          'border-indigo-600 bg-indigo-100 text-indigo-600 hover:bg-indigo-200/80',
        [TaskStatus.DONE]: 
          'border-emerald-600 bg-emerald-100 text-emerald-600 hover:bg-emerald-200/80',
        [TaskStatus.BACKLOG]: 
          'border-pink-600 bg-pink-100 text-pink-600 hover:bg-pink-200/80',
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
