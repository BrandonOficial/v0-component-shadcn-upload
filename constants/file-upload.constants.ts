import type { SupportedFileFormat } from "@/types/file-upload.types"

/**
 * Constantes para o sistema de upload de arquivos
 */

/**
 * Tamanho máximo padrão de arquivo em megabytes
 */
export const DEFAULT_MAX_FILE_SIZE_MB = 25

/**
 * Formatos de arquivo aceitos por padrão
 */
export const DEFAULT_ACCEPTED_FORMATS: SupportedFileFormat[] = [
  "PNG",
  "JPG",
  "PDF",
  "MP4",
]

/**
 * Mapeamento de extensões para MIME types
 */
export const FILE_FORMAT_MIME_MAP: Record<string, string> = {
  PNG: "image/png",
  JPG: "image/jpeg",
  JPEG: "image/jpeg",
  PDF: "application/pdf",
  MP4: "video/mp4",
}

/**
 * Conversão de bytes para unidades
 */
export const BYTES_PER_KB = 1024
export const BYTES_PER_MB = 1024 * 1024

/**
 * Mensagens de erro de validação
 */
export const VALIDATION_ERRORS = {
  UNSUPPORTED_FORMAT: (formats: string[]) =>
    `Formato não suportado. Use: ${formats.join(", ")}`,
  FILE_TOO_LARGE: (maxSize: number) =>
    `Arquivo muito grande. Tamanho máximo: ${maxSize}MB`,
} as const
