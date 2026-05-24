"use client"

import { useState, useCallback } from "react"
import { FileUpload } from "@/components/file-upload"
import { uploadDocuments } from "@/lib/upload-client"
import { toast } from "@/hooks/use-toast"

export default function Page() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleUpload = useCallback(async (files: File[]) => {
    if (files.length === 0) return

    setIsLoading(true)

    try {
      const result = await uploadDocuments(files)
      toast({
        title: "Upload concluído",
        description: result.message,
      })
      setSelectedFiles([])
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao fazer upload."
      toast({
        variant: "destructive",
        title: "Falha no envio",
        description: message,
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleReset = useCallback(() => {
    setSelectedFiles([])
  }, [])

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-6">
      <FileUpload
        files={selectedFiles}
        onFileSelect={setSelectedFiles}
        onUpload={handleUpload}
        onReset={handleReset}
        maxSize={25}
        acceptedFormats={["PNG", "JPG", "PDF", "MP4"]}
        isLoading={isLoading}
      />
    </main>
  )
}
