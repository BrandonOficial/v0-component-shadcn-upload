import { NextResponse } from "next/server"

// Constantes de segurança do servidor
const MAX_FILE_SIZE_MB = 10
const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"]

export async function POST(request: Request) {
  try {
    // 1. Intercepta o FormData vindo da requisição
    const formData = await request.formData()
    
    // Pega todos os arquivos atrelados à chave "documents"
    const files = formData.getAll("documents") as File[]

    // 2. Validação de Existência
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "Nenhum arquivo foi enviado." },
        { status: 400 } // Bad Request
      )
    }

    // 3. Validação ACID de Segurança (Re-validando no Servidor)
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        return NextResponse.json(
          { error: `O arquivo ${file.name} excede o limite de ${MAX_FILE_SIZE_MB}MB.` },
          { status: 413 } // Payload Too Large
        )
      }

      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `O tipo de arquivo ${file.type} não é suportado.` },
          { status: 415 } // Unsupported Media Type
        )
      }
    }

    // 4. Simulação de Salvamento e Processamento
    // No mundo real, aqui entraria a SDK da AWS S3, Supabase Storage, Cloudinary, etc.
    console.log(`Recebendo ${files.length} arquivo(s) para processamento...`)
    
    // Simulando o tempo de latência de gravação no disco/nuvem
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // 5. Montando a resposta RESTful
    // Retornamos os metadados fictícios provando que o arquivo foi "salvo"
    const uploadedFiles = files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      // Simulando a URL pública gerada pelo serviço de storage
      url: `https://storage.seudominio.com/uploads/${Date.now()}-${file.name.replace(/\s+/g, '-')}`,
    }))

    return NextResponse.json(
      { 
        message: "Upload realizado com sucesso!",
        files: uploadedFiles 
      },
      { status: 201 } // 201 Created (Padrão REST para criação de recursos)
    )

  } catch (error) {
    console.error("Erro crítico na API de upload:", error)
    return NextResponse.json(
      { error: "Erro interno no servidor ao processar o upload." },
      { status: 500 } // Internal Server Error
    )
  }
}