# File Upload — Componente Shadcn UI

![Next.js](https://img.shields.io/badge/Next.js-16+-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript)
![Vitest](https://img.shields.io/badge/Tested_with-Vitest-yellow?style=for-the-badge&logo=vitest)

Componente de upload de arquivos para **Next.js (App Router)** e **Shadcn UI**, com validação no cliente e no servidor, preview de imagens e API de exemplo.

## Funcionalidades

- Modo **controlado** (`files` + `onFileSelect`) — ideal para React Hook Form
- Validação por **extensão**, **MIME** e **magic bytes** (servidor)
- **Preview** de imagens na lista de ficheiros
- **Drag-and-drop** estável (sem flicker)
- Props: `maxSize`, `maxFiles`, `acceptedFormats`, `labels`, `showUploadButton`, `showPreview`
- Callback `onUpload(files)` para integrar com a tua API
- Cliente HTTP: `uploadDocuments()` em `lib/upload-client.ts`
- API demo: `POST /api/upload` → grava em `public/uploads/`

## Início rápido

```bash
pnpm install
pnpm dev
```

| Rota | Descrição |
|------|-----------|
| http://localhost:3000 | Demo com botão Enviar → API |
| http://localhost:3000/sandbox | Formulário RHF + Zod → API |

```bash
pnpm test          # testes unitários (Vitest)
pnpm test:e2e      # testes E2E (Playwright)
pnpm registry:build # gera public/r/*.json para CLI shadcn
pnpm lint
```

### Instalar via Shadcn CLI

```bash
pnpm registry:build && pnpm dev
# noutro terminal / projeto:
pnpm dlx shadcn@latest add @file-upload/file-upload
```

Ver [docs/REGISTRY.md](docs/REGISTRY.md).

## Uso do componente

### Controlado (recomendado)

```tsx
import { useState } from "react"
import { FileUpload } from "@/components/file-upload"

export function MyForm() {
  const [files, setFiles] = useState<File[]>([])

  return (
    <FileUpload
      files={files}
      onFileSelect={setFiles}
      maxSize={10}
      maxFiles={5}
      acceptedFormats={["PDF", "JPG", "PNG"]}
      onUpload={async (selected) => {
        // opção A: helper incluído
        const { uploadDocuments } = await import("@/lib/upload-client")
        await uploadDocuments(selected)
        setFiles([])
      }}
    />
  )
}
```

### Com React Hook Form + Zod

```tsx
<FileUpload
  files={field.value}
  onFileSelect={field.onChange}
  onReset={() => field.onChange([])}
  showUploadButton={false}
  maxFiles={5}
/>
```

Ver demo completa em `app/sandbox/page.tsx`.

## API de upload

### `POST /api/upload`

- **Body:** `multipart/form-data`, campo `documents` (repetível)
- **Limites:** 25MB/ficheiro, 20 ficheiros, formatos PNG/JPG/JPEG/PDF/MP4
- **Resposta 201:**

```json
{
  "message": "Upload realizado com sucesso! 1 arquivo(s) guardado(s).",
  "files": [
    {
      "name": "doc.pdf",
      "size": 1024,
      "type": "application/pdf",
      "url": "/uploads/1730000000000-doc.pdf"
    }
  ]
}
```

### Cliente

```ts
import { uploadDocuments } from "@/lib/upload-client"

const result = await uploadDocuments(files)
console.log(result.files[0].url)
```

## Props principais

| Prop | Tipo | Descrição |
|------|------|-----------|
| `files` | `File[]` | Modo controlado |
| `onFileSelect` | `(files: File[]) => void` | Notifica alterações |
| `onUpload` | `(files: File[]) => void \| Promise<void>` | Botão Enviar |
| `onReset` | `() => void` | Após Limpar |
| `maxSize` | `number` | MB por ficheiro |
| `maxFiles` | `number` | Quantidade máxima |
| `acceptedFormats` | `SupportedFileFormat[]` | PNG, JPG, JPEG, PDF, MP4 |
| `showUploadButton` | `boolean` | Rodapé (default `true`) |
| `showPreview` | `boolean` | Miniaturas de imagem (default `true`) |
| `labels` | `FileUploadLabels` | Textos customizados |
| `isLoading` | `boolean` | Estado de envio |

## Estrutura

```
components/file-upload.tsx   # UI
hooks/use-file-upload.ts     # Estado e drag-and-drop
hooks/use-file-previews.ts   # URLs de preview
lib/file-validation.ts       # Validação cliente
lib/file-signatures.ts       # Magic bytes
lib/upload-client.ts         # fetch → API
lib/server/                  # Validação e storage (servidor)
app/api/upload/route.ts      # Route handler
public/uploads/              # Ficheiros guardados (gitignored)
```

## Testes

**Vitest** (`pnpm test`):

- `file-validation`, `file-formatting`, `file-signatures`
- `use-file-upload`, `file-upload` (UI)
- `upload-client`, `server-upload-validation`

**Playwright** (`pnpm test:e2e`):

- `e2e/home.spec.ts` — seleção e upload na página principal
- `e2e/sandbox.spec.ts` — formulário RHF + POST `/api/upload`

## Licença

Projeto de estudo / portfolio. Usa e adapta livremente no teu projeto Shadcn.
