import { BYTES_PER_KB, BYTES_PER_MB } from "@/constants/file-upload.constants"

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
