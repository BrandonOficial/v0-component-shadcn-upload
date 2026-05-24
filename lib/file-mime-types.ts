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

/**
 * Retorna MIME types permitidos para os formatos aceitos
 */
export function getAllowedMimeTypes(
  formats: SupportedFileFormat[],
): string[] {
  const mimes = formats.map(
    (format) => FILE_FORMAT_MIME_MAP[format.toUpperCase()],
  )
  return [...new Set(mimes.filter(Boolean))]
}
