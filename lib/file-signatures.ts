import type { SupportedFileFormat } from "@/types/file-upload.types"
import { FILE_FORMAT_MIME_MAP } from "@/constants/file-upload.constants"

/**
 * Detecta MIME type pelos magic bytes do ficheiro
 */
export function sniffMimeType(bytes: Uint8Array): string | null {
  if (bytes.length < 4) return null

  // PDF: %PDF
  if (
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46
  ) {
    return "application/pdf"
  }

  // PNG
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "image/png"
  }

  // JPEG
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg"
  }

  // MP4: ....ftyp
  if (bytes.length >= 12) {
    const ftyp = String.fromCharCode(
      bytes[4],
      bytes[5],
      bytes[6],
      bytes[7],
    )
    if (ftyp === "ftyp") {
      return "video/mp4"
    }
  }

  return null
}

/**
 * Valida se o MIME detetado corresponde aos formatos aceites
 */
export function isMimeAllowedForFormats(
  mime: string,
  formats: SupportedFileFormat[],
): boolean {
  const allowed = formats.map(
    (f) => FILE_FORMAT_MIME_MAP[f.toUpperCase()],
  )
  return allowed.includes(mime)
}
