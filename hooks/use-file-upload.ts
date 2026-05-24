"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import type { FileUploadConfig } from "@/types/file-upload.types"
import { validateFiles } from "@/lib/file-validation"
import {
  DEFAULT_MAX_FILE_SIZE_MB,
  DEFAULT_ACCEPTED_FORMATS,
} from "@/constants/file-upload.constants"

interface UseFileUploadProps {
  /** Modo controlado: quando definido, o estado vem do pai */
  files?: File[]
  onFileSelect?: (files: File[]) => void
  config?: Partial<FileUploadConfig>
}

function clearInputElement(input: HTMLInputElement | null) {
  if (input) {
    input.value = ""
  }
}

export function useFileUpload({
  files: controlledFiles,
  onFileSelect,
  config,
}: UseFileUploadProps = {}) {
  const [uncontrolledFiles, setUncontrolledFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dragCounterRef = useRef(0)

  const isControlled = controlledFiles !== undefined
  const selectedFiles = isControlled ? controlledFiles : uncontrolledFiles

  const maxSize = config?.maxSize ?? DEFAULT_MAX_FILE_SIZE_MB
  const acceptedFormats = config?.acceptedFormats ?? DEFAULT_ACCEPTED_FORMATS
  const maxFiles = config?.maxFiles

  const onFileSelectRef = useRef(onFileSelect)
  useEffect(() => {
    onFileSelectRef.current = onFileSelect
  }, [onFileSelect])

  const updateFiles = useCallback(
    (next: File[]) => {
      if (!isControlled) {
        setUncontrolledFiles(next)
      }
      onFileSelectRef.current?.(next)
    },
    [isControlled],
  )

  // Sincroniza input quando o pai limpa arquivos (modo controlado)
  useEffect(() => {
    if (isControlled && controlledFiles.length === 0) {
      clearInputElement(inputRef.current)
    }
  }, [isControlled, controlledFiles])

  // Modo não controlado: notifica o pai após mudanças internas
  useEffect(() => {
    if (!isControlled) {
      onFileSelectRef.current?.(uncontrolledFiles)
    }
  }, [isControlled, uncontrolledFiles])

  const addFiles = useCallback(
    (incoming: FileList) => {
      const validationResult = validateFiles(
        incoming,
        acceptedFormats,
        maxSize,
        maxFiles,
        selectedFiles.length,
      )

      if (!validationResult.isValid) {
        setError(validationResult.errorMessage)
        clearInputElement(inputRef.current)
        return
      }

      setError(null)
      const newFiles = Array.from(incoming)
      updateFiles([...selectedFiles, ...newFiles])
      clearInputElement(inputRef.current)
    },
    [acceptedFormats, maxSize, maxFiles, selectedFiles, updateFiles],
  )

  const removeFile = useCallback(
    (index: number) => {
      const next = selectedFiles.filter((_, i) => i !== index)
      updateFiles(next)
      setError(null)
    },
    [selectedFiles, updateFiles],
  )

  const reset = useCallback(() => {
    updateFiles([])
    setError(null)
    clearInputElement(inputRef.current)
  }, [updateFiles])

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const incoming = event.target.files
      if (incoming && incoming.length > 0) {
        addFiles(incoming)
      }
    },
    [addFiles],
  )

  const handleDragEnter = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      dragCounterRef.current += 1
      setIsDragging(true)
    },
    [],
  )

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      dragCounterRef.current = 0
      setIsDragging(false)
      const incoming = event.dataTransfer.files
      if (incoming && incoming.length > 0) {
        addFiles(incoming)
      }
    },
    [addFiles],
  )

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
    },
    [],
  )

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      dragCounterRef.current -= 1
      if (dragCounterRef.current <= 0) {
        dragCounterRef.current = 0
        setIsDragging(false)
      }
    },
    [],
  )

  const openFileSelector = useCallback(() => {
    inputRef.current?.click()
  }, [])

  return {
    selectedFiles,
    error,
    isDragging,
    inputRef,
    maxSize,
    acceptedFormats,
    maxFiles,
    removeFile,
    reset,
    handleInputChange,
    handleDragEnter,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    openFileSelector,
  }
}
