import { BYTES_PER_KB, BYTES_PER_MB } from "@/constants/file-upload.constants"
import { getAcceptAttribute } from "@/lib/file-mime-types"
import type { SupportedFileFormat } from "@/types/file-upload.types"

/**
 * Formata tamanho de arquivo em bytes para formato legível
 * @param bytes - Tamanho em bytes
 * @returns String formatada (ex: "1.5 MB", "256 KB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes < BYTES_PER_KB) {
    return `${bytes} B`
  }

  if (bytes < BYTES_PER_MB) {
    return `${(bytes / BYTES_PER_KB).toFixed(1)} KB`
  }

  return `${(bytes / BYTES_PER_MB).toFixed(1)} MB`
}

/**
 * Gera mensagem pluralizada para quantidade de arquivos
 * @param count - Número de arquivos
 * @returns Mensagem formatada
 */
export function getFileCountMessage(count: number): string {
  if (count === 0) return "Drag your files here"
  if (count === 1) return "1 arquivo selecionado"
  return `${count} arquivos selecionados`
}

/**
 * Formata array de formatos aceitos para o atributo accept do input
 * @param formats - Array de formatos (ex: ["PNG", "JPG", "PDF"])
 * @returns String de MIME types separados por vírgula
 */
export function formatAcceptAttribute(formats: string[]): string {
  return getAcceptAttribute(formats as SupportedFileFormat[])
}
