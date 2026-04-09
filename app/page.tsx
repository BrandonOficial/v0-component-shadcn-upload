"use client"

import { useState } from "react"
import { FileUpload } from "@/components/file-upload"

export default function Page() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return
    setIsLoading(true)
    // Simula envio
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setSelectedFiles([])
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-6">
      <FileUpload
        onFileSelect={setSelectedFiles}
        onUpload={handleUpload}
        onReset={() => setSelectedFiles([])}
        maxSize={25}
        acceptedFormats={["PNG", "JPG", "PDF", "MP4"]}
        isLoading={isLoading}
      />
    </main>
  )
}
