import { describe, it, expect } from "vitest"
import { validateFile, validateFiles } from "@/lib/file-validation"
import { createTestFile, asFileList } from "./helpers/files"

describe("validateFile", () => {
  it("aceita PDF com MIME correto", () => {
    const file = createTestFile("doc.pdf", "application/pdf")
    const result = validateFile(file, ["PDF"], 10)
    expect(result.isValid).toBe(true)
  })

  it("rejeita extensão inválida", () => {
    const file = createTestFile("virus.exe", "application/octet-stream")
    const result = validateFile(file, ["PDF"], 10)
    expect(result.isValid).toBe(false)
    expect(result.errorMessage).toMatch(/Formato não suportado/)
  })

  it("rejeita MIME incompatível com a extensão", () => {
    const file = createTestFile("falso.pdf", "image/png")
    const result = validateFile(file, ["PDF"], 10)
    expect(result.isValid).toBe(false)
    expect(result.errorMessage).toMatch(/Tipo de arquivo inválido/)
  })

  it("rejeita arquivo acima do tamanho máximo", () => {
    const file = createTestFile("grande.pdf", "application/pdf", 11 * 1024 * 1024)
    const result = validateFile(file, ["PDF"], 10)
    expect(result.isValid).toBe(false)
    expect(result.errorMessage).toMatch(/muito grande/)
  })
})

describe("validateFiles", () => {
  it("rejeita quando excede maxFiles com arquivos já selecionados", () => {
    const result = validateFiles(
      asFileList([
        createTestFile("a.pdf", "application/pdf"),
        createTestFile("b.pdf", "application/pdf"),
      ]),
      ["PDF"],
      10,
      2,
      1,
    )
    expect(result.isValid).toBe(false)
    expect(result.errorMessage).toMatch(/Máximo de 2/)
  })
})
