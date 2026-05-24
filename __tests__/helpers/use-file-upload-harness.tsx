"use client"

import { useFileUpload } from "@/hooks/use-file-upload"
import type { FileUploadConfig } from "@/types/file-upload.types"

interface UseFileUploadHarnessProps {
  files?: File[]
  onFileSelect?: (files: File[]) => void
  config?: Partial<FileUploadConfig>
}

export function UseFileUploadHarness({
  files,
  onFileSelect,
  config,
}: UseFileUploadHarnessProps) {
  const upload = useFileUpload({ files, onFileSelect, config })

  return (
    <div data-testid="harness">
      <div
        data-testid="drop-zone"
        onDragEnter={upload.handleDragEnter}
        onDragOver={upload.handleDragOver}
        onDragLeave={upload.handleDragLeave}
        onDrop={upload.handleDrop}
      >
        <input
          data-testid="file-input"
          ref={upload.inputRef}
          type="file"
          onChange={upload.handleInputChange}
        />
        <span data-testid="file-count">{upload.selectedFiles.length}</span>
        <span data-testid="error">{upload.error ?? ""}</span>
        <span data-testid="dragging">
          {upload.isDragging ? "dragging" : "idle"}
        </span>
      </div>
      <button type="button" data-testid="remove-first" onClick={() => upload.removeFile(0)}>
        remove
      </button>
      <button type="button" data-testid="reset" onClick={upload.reset}>
        reset
      </button>
    </div>
  )
}
