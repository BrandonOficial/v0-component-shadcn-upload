"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { FileUploadConfig } from "@/types/file-upload.types";
import { validateFiles } from "@/lib/file-validation";
import {
  DEFAULT_MAX_FILE_SIZE_MB,
  DEFAULT_ACCEPTED_FORMATS,
} from "@/constants/file-upload.constants";

interface UseFileUploadProps {
  onFileSelect?: (files: File[]) => void;
  config?: Partial<FileUploadConfig>;
}

export function useFileUpload({
  onFileSelect,
  config,
}: UseFileUploadProps = {}) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const maxSize = config?.maxSize ?? DEFAULT_MAX_FILE_SIZE_MB;
  const acceptedFormats = config?.acceptedFormats ?? DEFAULT_ACCEPTED_FORMATS;

  const onFileSelectRef = useRef(onFileSelect);

  // Atualiza a referência silenciosamente caso o pai mude a função
  useEffect(() => {
    onFileSelectRef.current = onFileSelect;
  }, [onFileSelect]);

  // O useEffect que realmente avisa o pai só escuta a mudança real de arquivos
  useEffect(() => {
    onFileSelectRef.current?.(selectedFiles);
  }, [selectedFiles]);
  // ------------------------------------------------------

  const addFiles = useCallback(
    (files: FileList) => {
      const validationResult = validateFiles(files, acceptedFormats, maxSize);

      if (!validationResult.isValid) {
        setError(validationResult.errorMessage);
        return;
      }

      setError(null);
      const newFiles = Array.from(files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    },
    [acceptedFormats, maxSize],
  );

  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const reset = useCallback(() => {
    setSelectedFiles([]);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, []);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        addFiles(files);
      }
    },
    [addFiles],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const files = event.dataTransfer.files;
      if (files && files.length > 0) {
        addFiles(files);
      }
    },
    [addFiles],
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(true);
    },
    [],
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
    },
    [],
  );

  const openFileSelector = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return {
    selectedFiles,
    error,
    isDragging,
    inputRef,
    maxSize,
    acceptedFormats,
    removeFile,
    reset,
    handleInputChange,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    openFileSelector,
  };
}
