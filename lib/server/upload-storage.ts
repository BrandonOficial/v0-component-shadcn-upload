import { mkdir, writeFile } from "fs/promises"
import path from "path"

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads")

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_")
}

export interface SavedUploadFile {
  name: string
  size: number
  type: string
  url: string
  storedAs: string
}

export async function saveUploadedFile(file: File): Promise<SavedUploadFile> {
  await mkdir(UPLOAD_DIR, { recursive: true })

  const storedAs = `${Date.now()}-${sanitizeFileName(file.name)}`
  const filePath = path.join(UPLOAD_DIR, storedAs)
  const buffer = Buffer.from(await file.arrayBuffer())

  await writeFile(filePath, buffer)

  return {
    name: file.name,
    size: file.size,
    type: file.type || "application/octet-stream",
    url: `/uploads/${storedAs}`,
    storedAs,
  }
}

export async function saveUploadedFiles(
  files: File[],
): Promise<SavedUploadFile[]> {
  return Promise.all(files.map((file) => saveUploadedFile(file)))
}
