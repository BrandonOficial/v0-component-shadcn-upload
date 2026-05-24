/**
 * Barrel export para utilitários de upload de arquivos
 * Facilita imports agrupando exports relacionados
 * 
 * @example
 * import { validateFile, formatFileSize } from '@/lib/file-upload'
 */

// Validação
export {
  validateFile,
  validateFiles,
  getFileExtension,
} from "./file-validation"

// Formatação
export { formatFileSize, getFileCountMessage } from "./file-formatting"

// MIME Types
export { getAcceptAttribute, getAllowedMimeTypes } from "./file-mime-types"
export { sniffMimeType, isMimeAllowedForFormats } from "./file-signatures"
export { uploadDocuments } from "./upload-client"
export type { UploadApiResponse, UploadedFileMeta } from "./upload-client"

// Re-export de constantes
export {
  DEFAULT_MAX_FILE_SIZE_MB,
  DEFAULT_ACCEPTED_FORMATS,
  FILE_FORMAT_MIME_MAP,
  BYTES_PER_KB,
  BYTES_PER_MB,
  VALIDATION_ERRORS,
} from "@/constants/file-upload.constants"

// Re-export de tipos
export type {
  SupportedFileFormat,
  FileValidationResult,
  FileUploadConfig,
  FileUploadProps,
  FileUploadLabels,
  FileUploadHandle,
} from "@/types/file-upload.types"
