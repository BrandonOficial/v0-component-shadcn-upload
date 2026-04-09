import * as React from "react"

export type SupportedFileFormat = "PNG" | "JPG" | "JPEG" | "PDF" | "MP4"

export interface FileValidationResult {
  isValid: boolean
  errorMessage: string | null
}

export interface FileUploadConfig {
  maxSize: number
  acceptedFormats: SupportedFileFormat[]
}

// OLHA A MÁGICA AQUI: Estendendo os atributos de Div nativa
export interface FileUploadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onDrop"> {
  onFileSelect?: (files: File[]) => void
  onUpload?: () => void
  onReset?: () => void
  maxSize?: number
  acceptedFormats?: SupportedFileFormat[]
  isLoading?: boolean
}