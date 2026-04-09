"use client"

import * as React from "react"
import { CloudUpload, X, RotateCcw, Upload } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { FileUploadProps } from "@/types/file-upload.types"
import { useFileUpload } from "@/hooks/use-file-upload"
import { formatFileSize, getFileCountMessage } from "@/lib/file-formatting"
import { getAcceptAttribute } from "@/lib/file-mime-types"
import {
  DEFAULT_MAX_FILE_SIZE_MB,
  DEFAULT_ACCEPTED_FORMATS,
} from "@/constants/file-upload.constants"

export const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      className, // Recebendo className externo
      onFileSelect,
      onUpload,
      onReset,
      maxSize = DEFAULT_MAX_FILE_SIZE_MB,
      acceptedFormats = DEFAULT_ACCEPTED_FORMATS,
      isLoading = false,
      ...props // Recebendo demais propriedades HTML
    },
    ref
  ) => {
    const {
      selectedFiles,
      error,
      isDragging,
      inputRef,
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

    const acceptAttribute = getAcceptAttribute(acceptedFormats)
    const hasFiles = selectedFiles.length > 0
    const hasError = !!error
    const isUploadDisabled = !hasFiles || hasError || isLoading

    const handleReset = () => {
      reset()
      onReset?.()
    }

    return (
      <Card
        ref={ref}
        className={cn("w-full max-w-md shadow-sm", className)}
        {...props}
      >
        <CardHeader className="flex flex-col gap-0.5 pb-3">
          <h2 className="text-base font-semibold leading-tight text-foreground">
            Enviar Arquivo
          </h2>
          <p className="text-sm text-muted-foreground">
            Selecione ou arraste os documentos para upload
          </p>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div
            role="button"
            tabIndex={0}
            aria-label="Área de upload. Arraste um arquivo ou clique para selecionar."
            onClick={openFileSelector}
            onKeyDown={(e) => e.key === "Enter" && openFileSelector()}
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
              aria-hidden="true"
            />

            <div className="flex flex-col items-center gap-1">
              <p className="text-sm font-medium text-foreground">
                {getFileCountMessage(selectedFiles.length)}
              </p>
              <p className="text-xs text-muted-foreground">
                ou clique para procurar
              </p>
            </div>
          </div>

          {/* Lista de arquivos selecionados */}
          {hasFiles && (
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

          {/* Mensagem de erro de validação */}
          {hasError && (
            <p className="text-xs font-medium text-destructive" role="alert">
              {error}
            </p>
          )}

          {/* Informações sobre restrições de upload */}
          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Formatos suportados:</span>{" "}
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
              <span className="font-medium text-foreground">Tamanho Máximo:</span>{" "}
              <span className="text-primary">{maxSize}MB</span>
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between pt-2">
          <Button
            variant="ghost"
            onClick={handleReset}
            disabled={isLoading || (!hasFiles && !hasError)}
            className="gap-2 text-muted-foreground hover:text-foreground"
            aria-label="Limpar seleção de arquivos"
          >
            <RotateCcw className="h-4 w-4" />
            Limpar
          </Button>
          <Button
            onClick={onUpload}
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
                Enviando...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Enviar {hasFiles && `(${selectedFiles.length})`}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    )
  }
)

FileUpload.displayName = "FileUpload"