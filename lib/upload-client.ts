import {
  UPLOAD_API_PATH,
  UPLOAD_FIELD_NAME,
} from "@/constants/upload-api.constants"

export interface UploadedFileMeta {
  name: string
  size: number
  type: string
  url: string
  storedAs?: string
}

export interface UploadApiResponse {
  message: string
  files: UploadedFileMeta[]
}

export interface UploadApiError {
  error: string
}

/**
 * Envia ficheiros para a API de upload do Next.js
 */
export async function uploadDocuments(
  files: File[],
  options?: {
    fieldName?: string
    endpoint?: string
  },
): Promise<UploadApiResponse> {
  const fieldName = options?.fieldName ?? UPLOAD_FIELD_NAME
  const endpoint = options?.endpoint ?? UPLOAD_API_PATH

  const formData = new FormData()
  files.forEach((file) => {
    formData.append(fieldName, file)
  })

  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  })

  const result = (await response.json()) as UploadApiResponse & UploadApiError

  if (!response.ok) {
    throw new Error(result.error ?? "Falha ao enviar os arquivos.")
  }

  return result
}
