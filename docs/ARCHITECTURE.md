# Arquitetura do Projeto - File Upload

> **Objetivo do repositório:** componente `FileUpload` para Shadcn/React + API de exemplo. O consumidor pode usar `uploadDocuments()` ou a própria API.

## 📁 Estrutura de Pastas

```
├── components/
│   ├── file-upload.tsx     # Componente principal (UI)
│   └── ui/                 # Primitivos shadcn/ui
├── hooks/
│   └── use-file-upload.ts  # Estado, drag-and-drop, validação
├── lib/
│   ├── file-validation.ts  # Extensão + MIME + tamanho + maxFiles
│   ├── file-formatting.ts  # Tamanho legível, mensagens
│   └── file-mime-types.ts  # accept attribute, MIME permitidos
├── types/
│   └── file-upload.types.ts
├── constants/
│   └── file-upload.constants.ts
├── app/
│   ├── api/upload/         # POST multipart → public/uploads
│   ├── page.tsx            # Demo simples (controlado + API)
│   └── sandbox/            # Demo com react-hook-form + zod + API
└── __tests__/              # Vitest
```

## 🔄 Fluxo de Dados

```
User Action (click / drag / input)
    ↓
FileUpload (UI)
    ↓
useFileUpload (estado controlado ou interno)
    ↓
validateFiles (lib pura)
    ↓
onFileSelect(files)  →  app pai (RHF, useState, etc.)
    ↓
onUpload?(files)     →  uploadDocuments() ou API custom
    ↓
POST /api/upload     →  validateServerFile + saveUploadedFiles
```

### Modo controlado (recomendado)

```tsx
<FileUpload
  files={files}
  onFileSelect={setFiles}
  onUpload={(selected) => { /* tua API aqui */ }}
/>
```

## ✅ Implementado

- Modo controlado via prop `files`
- `maxFiles`, `maxSize`, `acceptedFormats`
- Validação por extensão e MIME (`file.type`)
- Drag-and-drop com contador (evita flicker em filhos)
- `showUploadButton`, `showPreview`, `labels`, `onUpload(files[])`
- API demo com magic bytes e `public/uploads/`
- `lib/upload-client.ts`
- `forwardRef` no `Card` e no `FileUpload`
- A11y: teclado (Enter/Espaço), `aria-live` na lista, `role="alert"` em erros

## 🧪 Testes (Vitest)

| Arquivo | Cobertura |
|---------|-----------|
| `file-validation.test.ts` | Extensão, MIME, tamanho, maxFiles |
| `file-formatting.test.ts` | formatFileSize, getFileCountMessage |
| `use-file-upload.test.tsx` | Controlado/não controlado, erro, maxFiles, drag counter |
| `file-upload.test.tsx` | UI, labels, onUpload, onReset, erro visível |

```bash
pnpm test
```

## ✨ Melhorias futuras (opcionais)

### UX
- [ ] Preview de imagens
- [ ] Barra de progresso (prop `onProgress`)
- [ ] Upload em chunks (fora do escopo do componente base)

### Validação
- [ ] Leitura de magic bytes no cliente (quando `file.type` vazio)
- [ ] Dimensões máximas de imagem

### Distribuição
- [ ] Registry shadcn (`components/ui/file-upload.tsx`)
- [ ] Pacote npm publicável

### Testes
- [x] E2E com Playwright (`e2e/home.spec.ts`, `e2e/sandbox.spec.ts`)

### Distribuição
- [x] Registry Shadcn (`registry.json` → `pnpm registry:build` → `public/r/`)
- [ ] Pacote npm publicável

### Acessibilidade
- [x] ARIA labels, teclado, aria-live na lista
- [ ] Região de status dedicada para leitores de tela após cada seleção

## 📚 Stack

- Next.js 16 (demos)
- React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Vitest + React Testing Library
