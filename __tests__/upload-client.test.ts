import { describe, it, expect, vi, beforeEach } from "vitest"
import { uploadDocuments } from "@/lib/upload-client"
import { createTestFile } from "./helpers/files"

describe("uploadDocuments", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn())
  })

  it("envia FormData e devolve resposta em sucesso", async () => {
    const mockFetch = vi.mocked(fetch)
    mockFetch.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          message: "OK",
          files: [{ name: "a.pdf", size: 10, type: "application/pdf", url: "/uploads/a.pdf" }],
        }),
        { status: 201 },
      ),
    )

    const file = createTestFile("a.pdf", "application/pdf")
    const result = await uploadDocuments([file])

    expect(result.message).toBe("OK")
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/upload",
      expect.objectContaining({ method: "POST" }),
    )
  })

  it("lança erro quando a API falha", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "Tipo inválido" }), {
        status: 415,
      }),
    )

    await expect(
      uploadDocuments([createTestFile("a.pdf", "application/pdf")]),
    ).rejects.toThrow("Tipo inválido")
  })
})
