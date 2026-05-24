import { describe, it, expect } from "vitest"
import { sniffMimeType, isMimeAllowedForFormats } from "@/lib/file-signatures"

describe("sniffMimeType", () => {
  it("deteta PDF", () => {
    const bytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d])
    expect(sniffMimeType(bytes)).toBe("application/pdf")
  })

  it("deteta PNG", () => {
    const bytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47])
    expect(sniffMimeType(bytes)).toBe("image/png")
  })

  it("deteta JPEG", () => {
    const bytes = new Uint8Array([0xff, 0xd8, 0xff, 0xe0])
    expect(sniffMimeType(bytes)).toBe("image/jpeg")
  })

  it("retorna null para bytes desconhecidos", () => {
    expect(sniffMimeType(new Uint8Array([0, 1, 2, 3]))).toBeNull()
  })
})

describe("isMimeAllowedForFormats", () => {
  it("aceita MIME mapeado", () => {
    expect(isMimeAllowedForFormats("application/pdf", ["PDF"])).toBe(true)
  })

  it("rejeita MIME fora da lista", () => {
    expect(isMimeAllowedForFormats("image/png", ["PDF"])).toBe(false)
  })
})
