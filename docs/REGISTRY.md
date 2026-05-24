# Registry Shadcn — File Upload

Este projeto expõe um **registry customizado** para instalar o componente com a CLI do shadcn.

## Gerar JSON estáticos

```bash
pnpm registry:build
```

Gera ficheiros em `public/r/` (ex.: `file-upload.json`, `registry.json`).

## Testar localmente

1. Build do registry e servidor de desenvolvimento:

```bash
pnpm registry:build
pnpm dev
```

2. Noutro projeto (ou neste), com `components.json` configurado:

```bash
# Namespace local
pnpm dlx shadcn@latest registry add @file-upload=http://localhost:3000/r/{name}.json

# Instalar só o componente
pnpm dlx shadcn@latest add @file-upload/file-upload

# Instalar componente + API de exemplo
pnpm dlx shadcn@latest add @file-upload/file-upload-api
```

3. Ou via URL direta:

```bash
pnpm dlx shadcn@latest add http://localhost:3000/r/file-upload.json
```

## Itens disponíveis

| Nome | Conteúdo |
|------|----------|
| `file-upload` | Componente, hooks, validação cliente, tipos e constantes |
| `file-upload-api` | Route `app/api/upload`, storage, validação server, `upload-client` |

### Dependências shadcn

O bloco `file-upload` requer `button` e `card` (instalados automaticamente via `registryDependencies`).

## Publicar

Após deploy (Vercel, etc.), substitui `localhost:3000` pela URL de produção:

```json
{
  "registries": {
    "@file-upload": "https://seu-dominio.com/r/{name}.json"
  }
}
```

## Verificar registry

```bash
pnpm dlx shadcn@latest list http://localhost:3000/r/registry.json
pnpm dlx shadcn@latest view http://localhost:3000/r/file-upload.json
```
