import { describe, it, expect } from "vitest"
import { formatFileSize, getFileCountMessage } from "@/lib/file-formatting"

describe("formatFileSize", () => {
  it("formata bytes", () => {
    expect(formatFileSize(512)).toBe("512 B")
  })

  it("formata kilobytes", () => {
    expect(formatFileSize(2048)).toBe("2.0 KB")
  })

  it("formata megabytes", () => {
    expect(formatFileSize(2 * 1024 * 1024)).toBe("2.0 MB")
  })
})

describe("getFileCountMessage", () => {
  it("retorna mensagem para zero arquivos", () => {
    expect(getFileCountMessage(0)).toBe("Arraste os arquivos aqui")
  })

  it("retorna mensagem para um arquivo", () => {
    expect(getFileCountMessage(1)).toBe("1 arquivo selecionado")
  })

  it("retorna mensagem plural", () => {
    expect(getFileCountMessage(3)).toBe("3 arquivos selecionados")
  })
})
