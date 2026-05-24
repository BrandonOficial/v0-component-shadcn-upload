import type { SupportedFileFormat } from "@/types/file-upload.types"
import type { FileValidationResult } from "@/types/file-upload.types"
import { getFileExtension } from "@/lib/file-validation"
import { sniffMimeType, isMimeAllowedForFormats } from "@/lib/file-signatures"
import { getAllowedMimeTypes } from "@/lib/file-mime-types"
import {
  BYTES_PER_MB,
  VALIDATION_ERRORS,
} from "@/constants/file-upload.constants"

export interface ServerUploadOptions {
  maxSizeMB: number
  maxFiles: number
  acceptedFormats: SupportedFileFormat[]
}

export function validateServerUploadBatch(
  files: File[],
  options: ServerUploadOptions,
): FileValidationResult {
  if (files.length === 0) {
    return {
      isValid: false,
      errorMessage: "Nenhum arquivo foi enviado.",
    }
  }

  if (files.length > options.maxFiles) {
    return {
      isValid: false,
      errorMessage: VALIDATION_ERRORS.TOO_MANY_FILES(options.maxFiles),
    }
  }

  return { isValid: true, errorMessage: null }
}

export async function validateServerFile(
  file: File,
  options: Pick<ServerUploadOptions, "maxSizeMB" | "acceptedFormats">,
): Promise<FileValidationResult> {
  const extension = getFileExtension(file.name)
  const normalizedFormats = options.acceptedFormats.map((f) =>
    f.toUpperCase(),
  )

  if (!extension || !normalizedFormats.includes(extension)) {
    return {
      isValid: false,
      errorMessage: VALIDATION_ERRORS.UNSUPPORTED_FORMAT(
        options.acceptedFormats,
      ),
    }
  }

  const maxSizeBytes = options.maxSizeMB * BYTES_PER_MB
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      errorMessage: VALIDATION_ERRORS.FILE_TOO_LARGE(options.maxSizeMB),
    }
  }

  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer())
  const sniffed = sniffMimeType(header)

  if (!sniffed) {
    return {
      isValid: false,
      errorMessage: VALIDATION_ERRORS.INVALID_MIME(options.acceptedFormats),
    }
  }

  if (!isMimeAllowedForFormats(sniffed, options.acceptedFormats)) {
    return {
      isValid: false,
      errorMessage: VALIDATION_ERRORS.INVALID_MIME(options.acceptedFormats),
    }
  }

  const allowedMimes = getAllowedMimeTypes(options.acceptedFormats)
  if (file.type && !allowedMimes.includes(file.type)) {
    return {
      isValid: false,
      errorMessage: VALIDATION_ERRORS.INVALID_MIME(options.acceptedFormats),
    }
  }

  if (file.type && file.type !== sniffed) {
    return {
      isValid: false,
      errorMessage: VALIDATION_ERRORS.INVALID_MIME(options.acceptedFormats),
    }
  }

  return { isValid: true, errorMessage: null }
}
