import type {
  FileValidationResult,
  SupportedFileFormat,
} from "@/types/file-upload.types"
import {
  BYTES_PER_MB,
  VALIDATION_ERRORS,
} from "@/constants/file-upload.constants"

/**
 * Extrai a extensão de um arquivo
 * @param filename - Nome do arquivo
 * @returns Extensão em maiúsculas ou string vazia
 */
export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toUpperCase() ?? ""
}

/**
 * Valida se um arquivo está dentro dos critérios estabelecidos
 * @param file - Arquivo a ser validado
 * @param acceptedFormats - Formatos aceitos
 * @param maxSizeMB - Tamanho máximo em MB
 * @returns Resultado da validação
 */
export function validateFile(
  file: File,
  acceptedFormats: SupportedFileFormat[],
  maxSizeMB: number,
): FileValidationResult {
  const extension = getFileExtension(file.name)
  const normalizedFormats = acceptedFormats.map((f) => f.toUpperCase())

  // Validação de formato
  if (!normalizedFormats.includes(extension)) {
    return {
      isValid: false,
      errorMessage: VALIDATION_ERRORS.UNSUPPORTED_FORMAT(acceptedFormats),
    }
  }

  // Validação de tamanho
  const maxSizeBytes = maxSizeMB * BYTES_PER_MB
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      errorMessage: VALIDATION_ERRORS.FILE_TOO_LARGE(maxSizeMB),
    }
  }

  return {
    isValid: true,
    errorMessage: null,
  }
}

/**
 * Valida múltiplos arquivos
 * @param files - Lista de arquivos
 * @param acceptedFormats - Formatos aceitos
 * @param maxSizeMB - Tamanho máximo em MB
 * @returns Resultado da primeira validação que falhar, ou sucesso
 */
export function validateFiles(
  files: FileList,
  acceptedFormats: SupportedFileFormat[],
  maxSizeMB: number,
): FileValidationResult {
  for (let i = 0; i < files.length; i++) {
    const result = validateFile(files[i], acceptedFormats, maxSizeMB)
    if (!result.isValid) {
      return result
    }
  }

  return {
    isValid: true,
    errorMessage: null,
  }
}
