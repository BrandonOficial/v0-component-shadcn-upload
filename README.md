# 📤 File Upload Component - shadcn/ui

Sistema completo de upload de arquivos com drag-and-drop, suporte a múltiplos arquivos, validação e interface moderna construída com Next.js 16 e shadcn/ui.

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## ✨ Features

- ✅ Upload de múltiplos arquivos simultaneamente
- ✅ Drag-and-drop intuitivo
- ✅ Validação de formato e tamanho
- ✅ Preview da lista de arquivos selecionados
- ✅ Remoção individual de arquivos
- ✅ Estados de loading e erro
- ✅ Totalmente acessível (ARIA, teclado)
- ✅ Responsivo e mobile-friendly
- ✅ Arquitetura SOLID e Clean Code

## 🏗️ Arquitetura

O projeto segue os princípios **SOLID** e **Clean Code**:

- **Single Responsibility**: Cada módulo tem uma responsabilidade única
- **Open/Closed**: Extensível via props sem modificar código
- **Liskov Substitution**: Interfaces bem definidas
- **Interface Segregation**: Interfaces específicas para cada necessidade
- **Dependency Inversion**: Dependências de abstrações

Veja mais detalhes em [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_MtauhKWJU00DjTYsncHWFEwHQ0oc)

## 🚀 Getting Started

### Instalação

```bash
# Instalar dependências
pnpm install

# Rodar servidor de desenvolvimento
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### Uso Básico

```tsx
import { FileUpload } from "@/components/file-upload"

export default function MyPage() {
  const [files, setFiles] = useState<File[]>([])

  const handleUpload = async () => {
    // Implementar lógica de upload
    console.log("Uploading:", files)
  }

  return (
    <FileUpload
      onFileSelect={setFiles}
      onUpload={handleUpload}
      maxSize={25}
      acceptedFormats={["PNG", "JPG", "PDF"]}
    />
  )
}
```

## 📂 Estrutura do Projeto

```
├── app/                  # Next.js App Router
├── components/           # Componentes React
│   └── file-upload.tsx  # Componente principal
├── hooks/                # Custom React Hooks
│   └── use-file-upload.ts
├── lib/                  # Utilitários
│   ├── file-validation.ts
│   ├── file-formatting.ts
│   └── file-mime-types.ts
├── types/                # TypeScript types
└── constants/            # Constantes
```

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.

<a href="https://v0.app/chat/api/kiro/clone/BrandonOficial/v0-component-shadcn-upload" alt="Open in Kiro"><img src="https://pdgvvgmkdvyeydso.public.blob.vercel-storage.com/open%20in%20kiro.svg?sanitize=true" /></a>
