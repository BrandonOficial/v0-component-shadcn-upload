"use client"

import { useEffect, useMemo, useState } from "react"

function fileKey(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`
}

/**
 * Gera URLs de preview para imagens e revoga ao desmontar ou remover
 */
export function useFilePreviews(files: File[]) {
  const [previewMap, setPreviewMap] = useState<Record<string, string>>({})

  const imageFiles = useMemo(
    () => files.filter((f) => f.type.startsWith("image/")),
    [files],
  )

  useEffect(() => {
    const next: Record<string, string> = {}
    for (const file of imageFiles) {
      next[fileKey(file)] = URL.createObjectURL(file)
    }

    setPreviewMap(next)

    return () => {
      Object.values(next).forEach((url) => URL.revokeObjectURL(url))
    }
  }, [imageFiles])

  const getPreviewUrl = (file: File) => previewMap[fileKey(file)]

  return { getPreviewUrl }
}
