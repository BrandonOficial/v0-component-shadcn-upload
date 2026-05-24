import { NextResponse } from "next/server"
import {
  API_ACCEPTED_FORMATS,
  API_MAX_FILES,
  API_MAX_FILE_SIZE_MB,
  UPLOAD_FIELD_NAME,
} from "@/constants/upload-api.constants"
import {
  validateServerFile,
  validateServerUploadBatch,
} from "@/lib/server/upload-validation"
import { saveUploadedFiles } from "@/lib/server/upload-storage"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const files = formData
      .getAll(UPLOAD_FIELD_NAME)
      .filter((entry): entry is File => entry instanceof File)

    const batchResult = validateServerUploadBatch(files, {
      maxSizeMB: API_MAX_FILE_SIZE_MB,
      maxFiles: API_MAX_FILES,
      acceptedFormats: API_ACCEPTED_FORMATS,
    })

    if (!batchResult.isValid) {
      return NextResponse.json(
        { error: batchResult.errorMessage },
        { status: 400 },
      )
    }

    for (const file of files) {
      const fileResult = await validateServerFile(file, {
        maxSizeMB: API_MAX_FILE_SIZE_MB,
        acceptedFormats: API_ACCEPTED_FORMATS,
      })

      if (!fileResult.isValid) {
        const status = fileResult.errorMessage?.includes("grande")
          ? 413
          : 415
        return NextResponse.json(
          { error: fileResult.errorMessage },
          { status },
        )
      }
    }

    const uploadedFiles = await saveUploadedFiles(files)

    return NextResponse.json(
      {
        message: `Upload realizado com sucesso! ${uploadedFiles.length} arquivo(s) guardado(s).`,
        files: uploadedFiles,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Erro na API de upload:", error)
    return NextResponse.json(
      { error: "Erro interno no servidor ao processar o upload." },
      { status: 500 },
    )
  }
}
