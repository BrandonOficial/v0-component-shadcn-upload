import * as React from "react"

export type SupportedFileFormat = "PNG" | "JPG" | "JPEG" | "PDF" | "MP4"

export interface FileValidationResult {
  isValid: boolean
  errorMessage: string | null
}

export interface FileUploadConfig {
  maxSize: number
  acceptedFormats: SupportedFileFormat[]
  maxFiles?: number
}

export interface FileUploadLabels {
  title?: string
  description?: string
  dropHint?: string
  browseHint?: string
  supportedFormats?: string
  maxSize?: string
  clear?: string
  upload?: string
  uploading?: string
}

export interface FileUploadHandle {
  reset: () => void
}

export interface FileUploadProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onDrop"> {
  /** Modo controlado: lista de arquivos gerenciada pelo pai */
  files?: File[]
  onFileSelect?: (files: File[]) => void
  onUpload?: (files: File[]) => void | Promise<void>
  onReset?: () => void
  maxSize?: number
  maxFiles?: number
  acceptedFormats?: SupportedFileFormat[]
  isLoading?: boolean
  /** Exibe o botão "Enviar" no rodapé do card (padrão: true) */
  showUploadButton?: boolean
  /** Miniatura para ficheiros de imagem (padrão: true) */
  showPreview?: boolean
  labels?: FileUploadLabels
}
