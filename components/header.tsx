'use client'

import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

interface HeaderProps {
  breadcrumb: string[]
  title: string
  description?: string
  action?: React.ReactNode
}




export function Header({ breadcrumb, title, description, action }: HeaderProps) {
  return (
    <div className="border-b border-border bg-background sticky top-0 z-40">
      <div className="px-4 md:px-8 py-3 md:py-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 md:mb-6 text-xs md:text-sm overflow-x-auto">
          {breadcrumb.map((item, idx) => (
            <motion.div key={idx} className="flex items-center gap-2 whitespace-nowrap">
              {idx > 0 && <ChevronRight size={16} className="text-muted flex-shrink-0" />}
              <span className={idx === breadcrumb.length - 1 ? 'text-foreground font-500' : 'text-muted'}>
                {item}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Title and Action */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-semibold text-foreground">{title}</h1>
            {description && <p className="text-xs md:text-sm text-muted mt-1">{description}</p>}
          </div>
          {action}
        </div>
      </div>
    </div>
  )
}
