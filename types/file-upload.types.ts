/**
 * Tipos e interfaces para o sistema de upload de arquivos
 */

/**
 * Formatos de arquivo suportados pelo sistema
 */
export type SupportedFileFormat = "PNG" | "JPG" | "JPEG" | "PDF" | "MP4"

/**
 * Resultado da validação de um arquivo
 */
export interface FileValidationResult {
  isValid: boolean
  errorMessage: string | null
}

/**
 * Configuração de upload de arquivos
 */
export interface FileUploadConfig {
  /** Tamanho máximo do arquivo em megabytes */
  maxSize: number
  /** Formatos de arquivo aceitos */
  acceptedFormats: SupportedFileFormat[]
}

/**
 * Props do componente FileUpload
 */
export interface FileUploadProps {
  /** Callback chamado quando arquivos são selecionados ou removidos */
  onFileSelect?: (files: File[]) => void
  /** Callback chamado quando o botão de upload é clicado */
  onUpload?: () => void
  /** Callback chamado quando o botão de reset é clicado */
  onReset?: () => void
  /** Tamanho máximo do arquivo em MB (padrão: 25) */
  maxSize?: number
  /** Formatos aceitos (padrão: ["PNG", "JPG", "PDF", "MP4"]) */
  acceptedFormats?: SupportedFileFormat[]
  /** Estado de carregamento durante upload */
  isLoading?: boolean
}
