"use client"

import { useState, useCallback } from "react"
import { FileUpload } from "@/components/file-upload"

/**
 * Tempo de simulação de upload em milissegundos
 */
const UPLOAD_SIMULATION_DELAY_MS = 2000

/**
 * Página principal da aplicação de upload de arquivos
 * 
 * Responsabilidades:
 * - Gerenciar estado dos arquivos selecionados
 * - Controlar estado de loading durante upload
 * - Coordenar o fluxo de upload
 */
export default function Page() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Handler de upload de arquivos
   * TODO: Implementar lógica real de upload para API/servidor
   * Atualmente apenas simula um upload com delay
   */
  const handleUpload = useCallback(async () => {
    if (selectedFiles.length === 0) return

    setIsLoading(true)

    try {
      // TODO: Substituir por chamada real de API
      // Exemplo: await uploadFiles(selectedFiles)
      await new Promise((resolve) => setTimeout(resolve, UPLOAD_SIMULATION_DELAY_MS))
      
      // Limpar arquivos após sucesso
      setSelectedFiles([])
    } catch (error) {
      // TODO: Adicionar tratamento de erro apropriado
      console.error("Erro ao fazer upload:", error)
    } finally {
      setIsLoading(false)
    }
  }, [selectedFiles])

  /**
   * Handler de reset da seleção
   */
  const handleReset = useCallback(() => {
    setSelectedFiles([])
  }, [])

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-6">
      <FileUpload
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
