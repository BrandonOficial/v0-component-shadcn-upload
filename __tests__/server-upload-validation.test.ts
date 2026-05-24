import { describe, it, expect } from "vitest"
import {
  validateServerUploadBatch,
  validateServerFile,
} from "@/lib/server/upload-validation"
import { createTestFile } from "./helpers/files"

describe("validateServerUploadBatch", () => {
  it("rejeita lista vazia", () => {
    const result = validateServerUploadBatch([], {
      maxSizeMB: 10,
      maxFiles: 5,
      acceptedFormats: ["PDF"],
    })
    expect(result.isValid).toBe(false)
  })

  it("rejeita quando excede maxFiles", () => {
    const files = Array.from({ length: 3 }, (_, i) =>
      createTestFile(`f${i}.pdf`, "application/pdf"),
    )
    const result = validateServerUploadBatch(files, {
      maxSizeMB: 10,
      maxFiles: 2,
      acceptedFormats: ["PDF"],
    })
    expect(result.isValid).toBe(false)
  })
})

describe("validateServerFile", () => {
  it("aceita PDF válido", async () => {
    const file = createTestFile("doc.pdf", "application/pdf")
    const result = await validateServerFile(file, {
      maxSizeMB: 10,
      acceptedFormats: ["PDF"],
    })
    expect(result.isValid).toBe(true)
  })

  it("rejeita quando MIME declarado não coincide com assinatura", async () => {
    const file = createTestFile("falso.pdf", "image/png")
    const result = await validateServerFile(file, {
      maxSizeMB: 10,
      acceptedFormats: ["PDF"],
    })
    expect(result.isValid).toBe(false)
    expect(result.errorMessage).toMatch(/inválido/i)
  })
})
