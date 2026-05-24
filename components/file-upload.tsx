"use client"

import * as React from "react"
import { CloudUpload, X, RotateCcw, Upload, FileIcon } from "lucide-react"
import { useFilePreviews } from "@/hooks/use-file-previews"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { FileUploadLabels, FileUploadProps } from "@/types/file-upload.types"
import { useFileUpload } from "@/hooks/use-file-upload"
import { formatFileSize, getFileCountMessage } from "@/lib/file-formatting"
import { getAcceptAttribute } from "@/lib/file-mime-types"
import {
  DEFAULT_MAX_FILE_SIZE_MB,
  DEFAULT_ACCEPTED_FORMATS,
} from "@/constants/file-upload.constants"

const DEFAULT_LABELS: Required<FileUploadLabels> = {
  title: "Enviar Arquivo",
  description: "Selecione ou arraste os documentos para upload",
  dropHint: "Arraste os arquivos aqui",
  browseHint: "ou clique para procurar",
  supportedFormats: "Formatos suportados:",
  maxSize: "Tamanho Máximo:",
  clear: "Limpar",
  upload: "Enviar",
  uploading: "Enviando...",
}

export const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      className,
      files,
      onFileSelect,
      onUpload,
      onReset,
      maxSize = DEFAULT_MAX_FILE_SIZE_MB,
      maxFiles,
      acceptedFormats = DEFAULT_ACCEPTED_FORMATS,
      isLoading = false,
      showUploadButton = true,
      showPreview = true,
      labels: labelsProp,
      ...props
    },
    ref,
  ) => {
    const labels = { ...DEFAULT_LABELS, ...labelsProp }

    const {
      selectedFiles,
      error,
      isDragging,
      inputRef,
      removeFile,
      reset,
      handleInputChange,
      handleDragEnter,
      handleDrop,
      handleDragOver,
      handleDragLeave,
      openFileSelector,
    } = useFileUpload({
      files,
      onFileSelect,
      config: { maxSize, acceptedFormats, maxFiles },
    })

    const { getPreviewUrl } = useFilePreviews(
      showPreview ? selectedFiles : [],
    )

    const acceptAttribute = getAcceptAttribute(acceptedFormats)
    const hasFiles = selectedFiles.length > 0
    const hasError = !!error
    const isUploadDisabled = !hasFiles || hasError || isLoading

    const handleReset = () => {
      reset()
      onReset?.()
    }

    const handleUploadClick = () => {
      if (!hasFiles || hasError || isLoading) return
      onUpload?.(selectedFiles)
    }

    const handleDropZoneKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        openFileSelector()
      }
    }

    return (
      <Card
        ref={ref}
        className={cn("w-full max-w-md shadow-sm", className)}
        {...props}
      >
        <CardHeader className="flex flex-col gap-0.5 pb-3">
          <h2 className="text-base font-semibold leading-tight text-foreground">
            {labels.title}
          </h2>
          <p className="text-sm text-muted-foreground">{labels.description}</p>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div
            role="button"
            tabIndex={0}
            aria-label="Área de upload. Arraste um arquivo ou clique para selecionar."
            onClick={openFileSelector}
            onKeyDown={handleDropZoneKeyDown}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "flex min-h-44 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border px-6 py-8 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isDragging
                ? "border-primary/50 bg-muted/70"
                : "hover:border-muted-foreground/40 hover:bg-muted/50",
              hasFiles && !hasError && "border-primary/40 bg-muted/30",
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept={acceptAttribute}
              multiple={maxFiles === undefined || maxFiles > 1}
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
              aria-hidden="true"
            />

            <div className="flex flex-col items-center gap-1">
              <p className="text-sm font-medium text-foreground">
                {hasFiles
                  ? getFileCountMessage(selectedFiles.length)
                  : labels.dropHint}
              </p>
              <p className="text-xs text-muted-foreground">{labels.browseHint}</p>
            </div>
          </div>

          {hasFiles && (
            <div
              className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-3"
              aria-live="polite"
              aria-relevant="additions removals"
            >
              {selectedFiles.map((file, index) => {
                const previewUrl = showPreview ? getPreviewUrl(file) : undefined
                const isImage = file.type.startsWith("image/")

                return (
                <div
                  key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
                  className="flex items-center justify-between gap-2 rounded-md bg-background px-3 py-2"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    {showPreview && isImage && previewUrl ? (
                      <img
                        src={previewUrl}
                        alt=""
                        className="h-12 w-12 shrink-0 rounded-md border border-border object-cover"
                      />
                    ) : (
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-border bg-muted"
                        aria-hidden
                      >
                        <FileIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex min-w-0 flex-col gap-0.5">
                    <p className="truncate text-sm font-medium text-foreground">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 flex-shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(index)
                    }}
                    aria-label={`Remover ${file.name}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )})}
            </div>
          )}

          {hasError && (
            <p className="text-xs font-medium text-destructive" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {labels.supportedFormats}
              </span>{" "}
              {acceptedFormats.map((format, index) => (
                <span key={format}>
                  <span className="text-primary">{format}</span>
                  {index < acceptedFormats.length - 1 && (
                    <span className="text-muted-foreground">, </span>
                  )}
                </span>
              ))}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{labels.maxSize}</span>{" "}
              <span className="text-primary">{maxSize}MB</span>
              {maxFiles !== undefined && (
                <>
                  {" "}
                  ·{" "}
                  <span className="text-primary">máx. {maxFiles} arquivo(s)</span>
                </>
              )}
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleReset}
            disabled={isLoading || (!hasFiles && !hasError)}
            className="gap-2 text-muted-foreground hover:text-foreground"
            aria-label={labels.clear}
          >
            <RotateCcw className="h-4 w-4" />
            {labels.clear}
          </Button>
          {showUploadButton && (
            <Button
              type="button"
              onClick={handleUploadClick}
              disabled={isUploadDisabled}
              className="gap-2"
              aria-label={`Fazer upload de ${selectedFiles.length} arquivo(s)`}
            >
              {isLoading ? (
                <>
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                    aria-hidden="true"
                  />
                  {labels.uploading}
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  {labels.upload}
                  {hasFiles && ` (${selectedFiles.length})`}
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    )
  },
)

FileUpload.displayName = "FileUpload"
