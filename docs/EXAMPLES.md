# Exemplos de Uso

## Uso Básico

```tsx
import { FileUpload } from "@/components/file-upload"
import { useState } from "react"

export default function BasicExample() {
  const [files, setFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleUpload = async (selected: File[]) => {
    setIsLoading(true)
    try {
      const { uploadDocuments } = await import("@/lib/upload-client")
      await uploadDocuments(selected)
      setFiles([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FileUpload
      files={files}
      onFileSelect={setFiles}
      onUpload={handleUpload}
      isLoading={isLoading}
    />
  )
}
```

## Com Configuração Personalizada

```tsx
export default function CustomConfigExample() {
  const [files, setFiles] = useState<File[]>([])

  return (
    <FileUpload
      onFileSelect={setFiles}
      onUpload={async () => {/* ... */}}
      maxSize={50} // 50MB
      acceptedFormats={["PNG", "JPG", "JPEG"]} // Apenas imagens
      isLoading={false}
    />
  )
}
```

## Com Upload Real para API

```tsx
import { FileUpload } from "@/components/file-upload"
import { useState } from "react"

export default function ApiUploadExample() {
  const [files, setFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async () => {
    if (files.length === 0) return

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      files.forEach((file, index) => {
        formData.append(`file-${index}`, file)
      })

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Erro ao fazer upload")
      }

      const data = await response.json()
      console.log("Upload bem-sucedido:", data)
      
      // Limpar arquivos após sucesso
      setFiles([])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setFiles([])
    setError(null)
  }

  return (
    <div>
      <FileUpload
        onFileSelect={setFiles}
        onUpload={handleUpload}
        onReset={handleReset}
        isLoading={isLoading}
      />
      {error && (
        <p className="mt-4 text-sm text-red-500">
          Erro: {error}
        </p>
      )}
    </div>
  )
}
```

## Com Progress Tracking

```tsx
import { FileUpload } from "@/components/file-upload"
import { useState } from "react"
import { Progress } from "@/components/ui/progress"

export default function ProgressExample() {
  const [files, setFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleUpload = async () => {
    if (files.length === 0) return

    setIsLoading(true)
    setProgress(0)

    try {
      // Simular progresso
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200))
        setProgress(i)
      }

      // Ou com upload real:
      // const xhr = new XMLHttpRequest()
      // xhr.upload.addEventListener("progress", (e) => {
      //   if (e.lengthComputable) {
      //     setProgress((e.loaded / e.total) * 100)
      //   }
      // })

      setFiles([])
    } finally {
      setIsLoading(false)
      setProgress(0)
    }
  }

  return (
    <div className="space-y-4">
      <FileUpload
        onFileSelect={setFiles}
        onUpload={handleUpload}
        isLoading={isLoading}
      />
      {isLoading && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-muted-foreground text-center">
            {progress}% concluído
          </p>
        </div>
      )}
    </div>
  )
}
```

## Com Validação Customizada

```tsx
import { FileUpload } from "@/components/file-upload"
import { useState, useEffect } from "react"

export default function CustomValidationExample() {
  const [files, setFiles] = useState<File[]>([])
  const [customError, setCustomError] = useState<string | null>(null)

  // Validação customizada adicional
  useEffect(() => {
    if (files.length > 5) {
      setCustomError("Máximo de 5 arquivos permitidos")
    } else {
      setCustomError(null)
    }
  }, [files])

  const handleUpload = async () => {
    if (customError) return
    // Proceder com upload
  }

  return (
    <div>
      <FileUpload
        onFileSelect={setFiles}
        onUpload={handleUpload}
        acceptedFormats={["PDF"]}
        maxSize={10}
      />
      {customError && (
        <p className="mt-2 text-sm text-red-500">{customError}</p>
      )}
    </div>
  )
}
```

## Com Notificações (Sonner)

```tsx
import { FileUpload } from "@/components/file-upload"
import { useState } from "react"
import { toast } from "sonner"

export default function ToastExample() {
  const [files, setFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleUpload = async () => {
    if (files.length === 0) return

    setIsLoading(true)
    const uploadPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simular sucesso ou erro
        Math.random() > 0.5 ? resolve(true) : reject(new Error("Falha"))
      }, 2000)
    })

    toast.promise(uploadPromise, {
      loading: "Fazendo upload...",
      success: () => {
        setFiles([])
        setIsLoading(false)
        return "Upload concluído com sucesso!"
      },
      error: (err) => {
        setIsLoading(false)
        return `Erro: ${err.message}`
      },
    })
  }

  const handleFileSelect = (selectedFiles: File[]) => {
    setFiles(selectedFiles)
    if (selectedFiles.length > 0) {
      toast.success(`${selectedFiles.length} arquivo(s) selecionado(s)`)
    }
  }

  return (
    <FileUpload
      onFileSelect={handleFileSelect}
      onUpload={handleUpload}
      isLoading={isLoading}
    />
  )
}
```

## Integração com React Hook Form

```tsx
import { FileUpload } from "@/components/file-upload"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const formSchema = z.object({
  files: z.array(z.instanceof(File)).min(1, "Selecione pelo menos um arquivo"),
  description: z.string().min(10, "Descrição muito curta"),
})

type FormData = z.infer<typeof formSchema>

export default function FormExample() {
  const [isLoading, setIsLoading] = useState(false)
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: [],
      description: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    console.log("Submitting:", data)
    // Implementar lógica de upload
    setIsLoading(false)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FileUpload
        onFileSelect={(files) => form.setValue("files", files)}
        onUpload={() => {}}
        isLoading={isLoading}
      />
      {form.formState.errors.files && (
        <p className="text-sm text-red-500">
          {form.formState.errors.files.message}
        </p>
      )}
      
      <textarea
        {...form.register("description")}
        className="w-full rounded-md border p-2"
        placeholder="Descrição dos arquivos..."
      />
      {form.formState.errors.description && (
        <p className="text-sm text-red-500">
          {form.formState.errors.description.message}
        </p>
      )}
      
      <button
        type="submit"
        disabled={isLoading}
        className="rounded-md bg-primary px-4 py-2 text-white"
      >
        Enviar Formulário
      </button>
    </form>
  )
}
```
