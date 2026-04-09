# Arquitetura do Projeto - File Upload

## 📁 Estrutura de Pastas

```
├── app/                      # Next.js App Router
│   ├── page.tsx             # Página principal
│   ├── layout.tsx           # Layout raiz
│   └── globals.css          # Estilos globais
│
├── components/              # Componentes React
│   ├── file-upload.tsx     # Componente principal de upload
│   └── ui/                 # Componentes UI shadcn/ui
│
├── hooks/                   # Custom React Hooks
│   └── use-file-upload.ts  # Lógica de upload de arquivos
│
├── lib/                     # Utilitários e helpers
│   ├── utils.ts            # Utilitários gerais
│   ├── file-validation.ts  # Validação de arquivos
│   ├── file-formatting.ts  # Formatação de dados
│   └── file-mime-types.ts  # Helpers de MIME types
│
├── types/                   # Definições TypeScript
│   └── file-upload.types.ts # Tipos do sistema de upload
│
└── constants/               # Constantes da aplicação
    └── file-upload.constants.ts # Constantes de upload
```

## 🎯 Princípios SOLID Aplicados

### 1. **Single Responsibility Principle (SRP)**
Cada módulo tem uma única responsabilidade:

- **`file-upload.tsx`**: Apenas renderização da UI
- **`use-file-upload.ts`**: Lógica de estado e handlers
- **`file-validation.ts`**: Validação de arquivos
- **`file-formatting.ts`**: Formatação de dados
- **`file-mime-types.ts`**: Conversão de tipos MIME

### 2. **Open/Closed Principle (OCP)**
O componente é aberto para extensão, fechado para modificação:

- Props configuráveis (`maxSize`, `acceptedFormats`)
- Callbacks opcionais (`onFileSelect`, `onUpload`, `onReset`)
- Estilos personalizáveis via Tailwind CSS

### 3. **Liskov Substitution Principle (LSP)**
Interfaces bem definidas permitem substituição:

- `FileUploadProps` define contrato claro
- `FileValidationResult` retorna estrutura consistente
- Funções puras retornam valores previsíveis

### 4. **Interface Segregation Principle (ISP)**
Interfaces específicas para cada necessidade:

- `FileUploadProps`: Props do componente
- `FileUploadConfig`: Configuração isolada
- `FileValidationResult`: Resultado de validação

### 5. **Dependency Inversion Principle (DIP)**
Dependências de abstrações, não implementações:

- Componente depende de props/callbacks
- Hook depende de funções utilitárias
- Validação independente de UI

## 🧩 Clean Code - Boas Práticas

### Nomenclatura
✅ **Variáveis e funções**: camelCase descritivo
```typescript
const selectedFiles: File[]
const handleUpload = () => {}
```

✅ **Tipos e interfaces**: PascalCase com sufixo descritivo
```typescript
interface FileUploadProps
type SupportedFileFormat
```

✅ **Constantes**: UPPER_SNAKE_CASE
```typescript
const DEFAULT_MAX_FILE_SIZE_MB = 25
const BYTES_PER_MB = 1024 * 1024
```

✅ **Componentes**: PascalCase
```typescript
export function FileUpload() {}
```

### Funções Puras
Funções sem side effects quando possível:
```typescript
export function formatFileSize(bytes: number): string
export function validateFile(file: File, ...): FileValidationResult
```

### Comentários JSDoc
Documentação clara para APIs públicas:
```typescript
/**
 * Valida se um arquivo está dentro dos critérios estabelecidos
 * @param file - Arquivo a ser validado
 * @param acceptedFormats - Formatos aceitos
 * @param maxSizeMB - Tamanho máximo em MB
 * @returns Resultado da validação
 */
```

### Separação de Concerns
- **UI**: Componentes React
- **Lógica**: Custom hooks
- **Validação**: Funções puras em lib/
- **Tipos**: Arquivos .types.ts
- **Constantes**: Arquivos .constants.ts

## 🔄 Fluxo de Dados

```
User Action
    ↓
FileUpload Component (UI)
    ↓
useFileUpload Hook (State + Logic)
    ↓
Validation Functions (Pure)
    ↓
State Update
    ↓
Callback to Parent (onFileSelect)
```

## ✨ Melhorias Futuras Sugeridas

### Backend Integration
- [ ] Criar serviço de upload (`/lib/services/upload-service.ts`)
- [ ] Implementar API route (`/app/api/upload/route.ts`)
- [ ] Adicionar progress tracking
- [ ] Implementar retry logic

### UX Enhancements
- [ ] Preview de imagens antes do upload
- [ ] Barra de progresso por arquivo
- [ ] Suporte a upload em chunks
- [ ] Cancelamento de uploads em progresso

### Validação Avançada
- [ ] Validação de tipo MIME real (não só extensão)
- [ ] Scan de vírus/malware
- [ ] Validação de dimensões de imagem
- [ ] Compressão automática de imagens grandes

### Testes
- [ ] Unit tests para validação
- [ ] Unit tests para formatação
- [ ] Integration tests para hook
- [ ] E2E tests para componente

### Acessibilidade
- [x] ARIA labels implementados
- [x] Navegação por teclado
- [ ] Anúncios de screen reader para uploads
- [ ] Modo de alto contraste

## 📚 Tecnologias Utilizadas

- **Next.js 16**: Framework React
- **TypeScript**: Type safety
- **Tailwind CSS v4**: Estilização
- **shadcn/ui**: Componentes UI
- **Radix UI**: Primitivos acessíveis
- **Lucide React**: Ícones
