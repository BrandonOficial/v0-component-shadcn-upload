"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { CloudUpload, X, RotateCcw, Upload } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface FileUploadProps {
  onFileSelect?: (files: File[]) => void
  onUpload?: () => void
  onReset?: () => void
  maxSize?: number // in MB
  acceptedFormats?: string[]
  isLoading?: boolean
}

export function FileUpload({
  onFileSelect,
  onUpload,
  onReset,
  maxSize = 25,
  acceptedFormats = ["PNG", "JPG", "PDF", "MP4"],
  isLoading = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    onFileSelect?.(selectedFiles)
  }, [selectedFiles, onFileSelect])

  const acceptAttribute = acceptedFormats
    .map((fmt) => {
      const map: Record<string, string> = {
        PNG: "image/png",
        JPG: "image/jpeg",
        JPEG: "image/jpeg",
        PDF: "application/pdf",
        MP4: "video/mp4",
      }
      return map[fmt.toUpperCase()] ?? `.${fmt.toLowerCase()}`
    })
    .join(",")

  const validateFile = useCallback(
    (file: File): string | null => {
      const ext = file.name.split(".").pop()?.toUpperCase() ?? ""
      if (!acceptedFormats.map((f) => f.toUpperCase()).includes(ext)) {
        return `Formato não suportado. Use: ${acceptedFormats.join(", ")}`
      }
      if (file.size > maxSize * 1024 * 1024) {
        return `Arquivo muito grande. Tamanho máximo: ${maxSize}MB`
      }
      return null
    },
    [acceptedFormats, maxSize],
  )

  const handleSelect = useCallback(
    (files: FileList) => {
      const newFiles: File[] = []
      let validationError: string | null = null

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const error = validateFile(file)
        if (error) {
          validationError = error
          break
        }
        newFiles.push(file)
      }

      if (validationError) {
        setError(validationError)
        return
      }

      setError(null)
      setSelectedFiles((prev) => {
        const updated = [...prev, ...newFiles]
        return updated
      })
    },
    [validateFile],
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) handleSelect(files)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files && files.length > 0) handleSelect(files)
  }

  const handleReset = () => {
    setSelectedFiles([])
    setError(null)
    if (inputRef.current) inputRef.current.value = ""
    onReset?.()
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <Card className="w-full max-w-md shadow-sm">
      <CardHeader className="flex flex-col gap-0.5 pb-3">
        <h2 className="text-base font-semibold leading-tight text-foreground">
          Upload File
        </h2>
        <p className="text-sm text-muted-foreground">Polish, perfect and enhance</p>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* Dropzone */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Área de upload. Arraste um arquivo ou clique para selecionar."
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "flex min-h-44 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border px-6 py-8 text-center transition-colors",
            isDragging
              ? "border-primary/50 bg-muted/70"
              : "hover:border-muted-foreground/40 hover:bg-muted/50",
            selectedFiles.length > 0 && !error && "border-primary/40 bg-muted/30",
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept={acceptAttribute}
            multiple
            onChange={handleInputChange}
            className="sr-only"
            aria-hidden="true"
            tabIndex={-1}
          />

          <CloudUpload
            className={cn(
              "h-10 w-10 transition-colors",
              isDragging ? "text-primary" : "text-muted-foreground",
            )}
            strokeWidth={1.5}
          />

          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-medium text-foreground">
              {selectedFiles.length > 0
                ? `${selectedFiles.length} arquivo${selectedFiles.length > 1 ? "s" : ""} selecionado${selectedFiles.length > 1 ? "s" : ""}`
                : "Drag your files here"}
            </p>
            <p className="text-xs text-muted-foreground">
              or click to browse
            </p>
          </div>
        </div>

        {/* Selected Files List */}
        {selectedFiles.length > 0 && (
          <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-3">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between gap-2 rounded-md bg-background px-3 py-2"
              >
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="truncate text-sm font-medium text-foreground">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 flex-shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => removeFile(index)}
                  aria-label={`Remover ${file.name}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Validation error */}
        {error && (
          <p className="text-xs font-medium text-destructive">{error}</p>
        )}

        {/* Info */}
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Supported formats:</span>{" "}
            {acceptedFormats.map((fmt, i) => (
              <span key={fmt}>
                <span className="text-primary">{fmt}</span>
                {i < acceptedFormats.length - 1 && (
                  <span className="text-muted-foreground">, </span>
                )}
              </span>
            ))}
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Maximum Size:</span>{" "}
            <span className="text-primary">{maxSize}MB</span>
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-2">
        <Button
          variant="ghost"
          onClick={handleReset}
          disabled={isLoading}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
        <Button
          onClick={onUpload}
          disabled={selectedFiles.length === 0 || !!error || isLoading}
          className="gap-2"
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
