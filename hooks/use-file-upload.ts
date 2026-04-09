import { useState, useCallback, useRef, useEffect } from "react"
import type { FileUploadConfig } from "@/types/file-upload.types"
import { validateFiles } from "@/lib/file-validation"
import {
  DEFAULT_MAX_FILE_SIZE_MB,
  DEFAULT_ACCEPTED_FORMATS,
} from "@/constants/file-upload.constants"

/**
 * Props para o hook useFileUpload
 */
interface UseFileUploadProps {
  /** Callback chamado quando arquivos são selecionados */
  onFileSelect?: (files: File[]) => void
  /** Configuração de upload */
  config?: Partial<FileUploadConfig>
}

/**
 * Hook customizado para gerenciar estado e lógica de upload de arquivos
 * Segue o princípio Single Responsibility ao extrair toda a lógica de negócio
 *
 * @param props - Configurações do hook
 * @returns Estado e handlers para upload de arquivos
 */
export function useFileUpload({
  onFileSelect,
  config,
}: UseFileUploadProps = {}) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const maxSize = config?.maxSize ?? DEFAULT_MAX_FILE_SIZE_MB
  const acceptedFormats = config?.acceptedFormats ?? DEFAULT_ACCEPTED_FORMATS

  // Notifica componente pai quando arquivos mudam
  useEffect(() => {
    onFileSelect?.(selectedFiles)
  }, [selectedFiles, onFileSelect])

  /**
   * Adiciona arquivos à lista de selecionados após validação
   */
  const addFiles = useCallback(
    (files: FileList) => {
      const validationResult = validateFiles(files, acceptedFormats, maxSize)

      if (!validationResult.isValid) {
        setError(validationResult.errorMessage)
        return
      }

      setError(null)
      const newFiles = Array.from(files)
      setSelectedFiles((prev) => [...prev, ...newFiles])
    },
    [acceptedFormats, maxSize],
  )

  /**
   * Remove um arquivo específico da lista
   */
  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  /**
   * Reseta todo o estado do upload
   */
  const reset = useCallback(() => {
    setSelectedFiles([])
    setError(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }, [])

  /**
   * Handler para mudança no input de arquivo
   */
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (files && files.length > 0) {
        addFiles(files)
      }
    },
    [addFiles],
  )

  /**
   * Handler para evento de drop
   */
  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      setIsDragging(false)
      const files = event.dataTransfer.files
      if (files && files.length > 0) {
        addFiles(files)
      }
    },
    [addFiles],
  )

  /**
   * Handler para drag over
   */
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }, [])

  /**
   * Handler para drag leave
   */
  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      setIsDragging(false)
    },
    [],
  )

  /**
   * Abre o seletor de arquivos
   */
  const openFileSelector = useCallback(() => {
    inputRef.current?.click()
  }, [])

  return {
    // Estado
    selectedFiles,
    error,
    isDragging,
    inputRef,
    
    // Configuração
    maxSize,
    acceptedFormats,
    
    // Ações
    removeFile,
    reset,
    
    // Handlers
    handleInputChange,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    openFileSelector,
  }
}
