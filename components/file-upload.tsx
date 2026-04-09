"use client"

import { CloudUpload, X, RotateCcw, Upload } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useFileUpload } from "@/hooks/use-file-upload"
import { formatFileSize, formatAcceptAttribute } from "@/lib/file-formatting"
import type { FileUploadProps } from "@/types/file-upload.types"

/**
 * Componente de upload de arquivos com drag-and-drop
 * 
 * Features:
 * - Suporte a múltiplos arquivos
 * - Drag-and-drop intuitivo
 * - Validação de formato e tamanho
 * - Estados de loading e erro
 * - Totalmente acessível
 * 
 * @example
 * ```tsx
 * <FileUpload
 *   onFileSelect={(files) => console.log(files)}
 *   onUpload={() => handleUpload()}
 *   maxSize={25}
 *   acceptedFormats={["PNG", "JPG", "PDF"]}
 * />
 * ```
 */
export function FileUpload({
  onFileSelect,
  onUpload,
  onReset,
  maxSize,
  acceptedFormats,
  isLoading = false,
}: FileUploadProps) {
  const {
    selectedFiles,
    error,
    isDragging,
    inputRef,
    maxSize: configuredMaxSize,
    acceptedFormats: configuredFormats,
    removeFile,
    reset,
    handleInputChange,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    openFileSelector,
  } = useFileUpload({
    onFileSelect,
    config: { maxSize, acceptedFormats },
  })

  const handleReset = () => {
    reset()
    onReset?.()
  }

  const acceptAttribute = formatAcceptAttribute(configuredFormats)

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
          aria-label="Área de upload. Arraste arquivos ou clique para selecionar."
          onClick={openFileSelector}
          onKeyDown={(e) => e.key === "Enter" && openFileSelector()}
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
          <p className="text-xs font-medium text-destructive" role="alert">
            {error}
          </p>
        )}

        {/* Info */}
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Supported formats:</span>{" "}
            {configuredFormats.map((fmt, i) => (
              <span key={fmt}>
                <span className="text-primary">{fmt}</span>
                {i < configuredFormats.length - 1 && (
                  <span className="text-muted-foreground">, </span>
                )}
              </span>
            ))}
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Maximum Size:</span>{" "}
            <span className="text-primary">{configuredMaxSize}MB</span>
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
