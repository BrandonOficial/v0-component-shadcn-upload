import type { SupportedFileFormat } from "@/types/file-upload.types"

/** Chave do campo no FormData */
export const UPLOAD_FIELD_NAME = "documents"

/** Endpoint de upload */
export const UPLOAD_API_PATH = "/api/upload"

/** Limites da API (servidor) */
export const API_MAX_FILE_SIZE_MB = 25
export const API_MAX_FILES = 20

export const API_ACCEPTED_FORMATS: SupportedFileFormat[] = [
  "PNG",
  "JPG",
  "JPEG",
  "PDF",
  "MP4",
]
