# 📤 Advanced File Upload Component - Shadcn UI

![Next.js](https://img.shields.io/badge/Next.js-16+-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript)
![Vitest](https://img.shields.io/badge/Tested_with-Vitest-yellow?style=for-the-badge&logo=vitest)

Um componente de upload de arquivos de nível empresarial construído para o ecossistema **Next.js (App Router)** e **Shadcn UI**. 

Focado em Clean Code, esta biblioteca não é apenas visual: ela resolve problemas complexos de re-renderização, fornece validação robusta ponta a ponta (Client e Server) e é totalmente compatível com `react-hook-form` e `zod`.

## ✨ Features Premium

- 🛡️ **Arquitetura Blindada:** Implementação do padrão *Latest Ref* para evitar loops infinitos de re-render no React Hook Form.
- 🧪 **Testado e Aprovado:** Cobertura de testes automatizados de UI e comportamento com **Vitest** e React Testing Library.
- 🎯 **Integração Perfeita:** Feito para trabalhar nativamente com `zod` e `react-hook-form`.
- ✅ **Acessibilidade (A11y):** Foco visível (ring), navegação por teclado e suporte a leitores de tela.
- 🔒 **Validação Dupla:** Regras estritas de tamanho e formato (MIME type) aplicadas tanto no Hook do Front-end quanto na API RESTful do Back-end.
- 🧩 **100% Extensível (Open/Closed):** Aceita `className` e atributos nativos do HTML via `React.forwardRef`.

## 🏗️ Arquitetura SOLID

O projeto foi refatorado seguindo rigorosamente os princípios **SOLID**:
- **Single Responsibility**: O componente `<FileUpload />` apenas renderiza a UI. A lógica de negócio vive no `useFileUpload` e a validação em utilitários isolados (`lib/file-validation.ts`).
- **Open/Closed**: Totalmente estilizável via props e classes Tailwind sem precisar alterar o núcleo do componente.
- **Dependency Inversion**: Componente projetado para injetar regras e não ditar para onde o arquivo vai.

## 🚀 Getting Started

### 1. Instalação e Execução

```bash
# Clone o repositório e instale as dependências
pnpm install

# Rode o ambiente de desenvolvimento (Playground)
pnpm dev
```
Acesse http://localhost:3000/sandbox para ver o componente rodando em um formulário real simulando chamadas de API.

### 2. Rodando os Testes (Vitest)
```bash
pnpm test
```

## Como Usar(Usage)
A recomendação oficial é usar o componente atrelado ao ecossistema de formulários do Shadcn.
```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { FileUpload } from "@/components/file-upload"

const formSchema = z.object({
  documents: z.array(z.instanceof(File)).min(1, "Obrigatório"),
})

export default function DocumentForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data) => {
    const formData = new FormData()
    data.documents.forEach(file => formData.append("documents", file))
    
    await fetch("/api/upload", { method: "POST", body: formData })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="documents"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Documentos (Máx 10MB)</FormLabel>
              <FormControl>
                <FileUpload
                  maxSize={10}
                  acceptedFormats={["PDF", "JPG", "PNG"]}
                  onFileSelect={(files) => field.onChange(files)}
                  onReset={() => field.onChange([])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
```
## 📂 Estrutura de Diretórios
```plaintext
├── app/
│   ├── api/upload/       # Endpoint RESTful (Server-side validation)
│   └── sandbox/          # Playground de integração com formulário
├── components/
│   ├── ui/               # Componentes base do Shadcn
│   └── file-upload.tsx   # Componente Principal (Dumb Component)
├── hooks/
│   └── use-file-upload.ts # Hook de lógica e controle de re-render
├── lib/                  # Utilitários de validação ACID e formatação
└── __tests__/            # Testes Vitest (Comportamento e UI)
```
