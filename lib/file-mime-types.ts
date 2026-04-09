import type { SupportedFileFormat } from "@/types/file-upload.types"
import { FILE_FORMAT_MIME_MAP } from "@/constants/file-upload.constants"

/**
 * Converte formatos de arquivo para atributo accept do input
 * @param formats - Array de formatos suportados
 * @returns String para usar no atributo accept (ex: "image/png,image/jpeg")
 */
export function getAcceptAttribute(formats: SupportedFileFormat[]): string {
  return formats
    .map((format) => {
      const mimeType = FILE_FORMAT_MIME_MAP[format.toUpperCase()]
      return mimeType ?? `.${format.toLowerCase()}`
    })
    .join(",")
}
