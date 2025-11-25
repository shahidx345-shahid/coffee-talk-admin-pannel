'use client'

import { useState } from 'react'
import { ImageSkeleton } from './image-skeleton'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  width?: string | number
  height?: string | number
  onLoad?: () => void
  onError?: () => void
}

export function OptimizedImage({
  src,
  alt,
  className = '',
  priority = false,
  width,
  height,
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }

  if (hasError) {
    return (
      <div className={`bg-surface flex items-center justify-center text-muted text-xs ${className}`}>
        No Image
      </div>
    )
  }

  return (
    <>
      {isLoading && <ImageSkeleton className={className} />}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'hidden' : 'block'}`}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'low'}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        decoding="async"
      />
    </>
  )
}
