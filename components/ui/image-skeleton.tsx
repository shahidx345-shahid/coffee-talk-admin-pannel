'use client'

import { motion } from 'framer-motion'

interface ImageSkeletonProps {
  className?: string
}

export function ImageSkeleton({ className = '' }: ImageSkeletonProps) {
  return (
    <motion.div
      className={`bg-surface animate-pulse ${className}`}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  )
}
