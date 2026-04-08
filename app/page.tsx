"use client"

import { useState } from "react"
import { FileUpload } from "@/components/file-upload"

export default function Page() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpload = async () => {
    if (!selectedFile) return
    setIsLoading(true)
    // Simula envio
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setSelectedFile(null)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-6">
      <FileUpload
        onFileSelect={setSelectedFile}
        onUpload={handleUpload}
        onReset={() => setSelectedFile(null)}
        onClose={() => console.log("closed")}
        maxSize={25}
        acceptedFormats={["PNG", "JPG", "PDF", "MP4"]}
        isLoading={isLoading}
      />
    </main>
  )
}
