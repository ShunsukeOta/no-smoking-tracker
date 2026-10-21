import * as React from 'react'
import { cn } from '@/lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(({ className, type, ...props }, ref) => (
  <input type={type} className={cn('flex h-12 w-full rounded-xl border border-input bg-white px-4 py-2 text-base text-foreground shadow-sm shadow-black/[.015] outline-none transition-colors placeholder:text-muted-foreground/65 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-50', className)} ref={ref} {...props} />
))
Input.displayName = 'Input'
export { Input }
