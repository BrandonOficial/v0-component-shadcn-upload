import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { useState } from "react"
import { UseFileUploadHarness } from "./helpers/use-file-upload-harness"
import { createTestFile } from "./helpers/files"

describe("useFileUpload", () => {
  it("modo não controlado: adiciona arquivo e notifica o pai", async () => {
    const onFileSelect = vi.fn()
    const user = userEvent.setup()

    render(<UseFileUploadHarness onFileSelect={onFileSelect} config={{ acceptedFormats: ["PDF"], maxSize: 10 }} />)

    const input = screen.getByTestId("file-input")
    await user.upload(
      input,
      createTestFile("doc.pdf", "application/pdf"),
    )

    expect(screen.getByTestId("file-count")).toHaveTextContent("1")
    expect(onFileSelect).toHaveBeenLastCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ name: "doc.pdf" }),
      ]),
    )
  })

  it("modo controlado: delega lista ao pai", async () => {
    const onFileSelect = vi.fn()
    const user = userEvent.setup()

    function ControlledHarness() {
      const [files, setFiles] = useState<File[]>([])
      return (
        <UseFileUploadHarness
          files={files}
          onFileSelect={setFiles}
          config={{ acceptedFormats: ["PDF"], maxSize: 10 }}
        />
      )
    }

    render(<ControlledHarness />)

    await user.upload(
      screen.getByTestId("file-input"),
      createTestFile("a.pdf", "application/pdf"),
    )

    expect(screen.getByTestId("file-count")).toHaveTextContent("1")
  })

  it("rejeita arquivo inválido e expõe erro", async () => {
    const user = userEvent.setup()

    render(
      <UseFileUploadHarness
        config={{ acceptedFormats: ["PDF"], maxSize: 10 }}
      />,
    )

    await user.upload(
      screen.getByTestId("file-input"),
      createTestFile("imagem.png", "image/png"),
    )

    expect(screen.getByTestId("file-count")).toHaveTextContent("0")
    expect(screen.getByTestId("error").textContent).toMatch(/Formato não suportado|Tipo de arquivo inválido/)
  })

  it("respeita maxFiles", async () => {
    const user = userEvent.setup()

    render(
      <UseFileUploadHarness
        config={{ acceptedFormats: ["PDF"], maxSize: 10, maxFiles: 1 }}
      />,
    )

    const input = screen.getByTestId("file-input")
    await user.upload(input, createTestFile("a.pdf", "application/pdf"))
    await user.upload(input, createTestFile("b.pdf", "application/pdf"))

    expect(screen.getByTestId("file-count")).toHaveTextContent("1")
    expect(screen.getByTestId("error").textContent).toMatch(/Máximo de 1/)
  })

  it("removeFile limpa erro e atualiza contagem", async () => {
    const user = userEvent.setup()

    render(
      <UseFileUploadHarness
        config={{ acceptedFormats: ["PDF"], maxSize: 10 }}
      />,
    )

    await user.upload(
      screen.getByTestId("file-input"),
      createTestFile("doc.pdf", "application/pdf"),
    )
    await user.click(screen.getByTestId("remove-first"))

    expect(screen.getByTestId("file-count")).toHaveTextContent("0")
    expect(screen.getByTestId("error")).toHaveTextContent("")
  })

  it("reset limpa seleção", async () => {
    const user = userEvent.setup()

    render(
      <UseFileUploadHarness
        config={{ acceptedFormats: ["PDF"], maxSize: 10 }}
      />,
    )

    await user.upload(
      screen.getByTestId("file-input"),
      createTestFile("doc.pdf", "application/pdf"),
    )
    await user.click(screen.getByTestId("reset"))

    expect(screen.getByTestId("file-count")).toHaveTextContent("0")
  })

  it("não desativa drag ao sair para elemento filho (contador)", () => {
    render(<UseFileUploadHarness />)

    const dropZone = screen.getByTestId("drop-zone")

    fireEvent.dragEnter(dropZone)
    expect(screen.getByTestId("dragging")).toHaveTextContent("dragging")

    fireEvent.dragEnter(dropZone)
    fireEvent.dragLeave(dropZone)
    expect(screen.getByTestId("dragging")).toHaveTextContent("dragging")

    fireEvent.dragLeave(dropZone)
    expect(screen.getByTestId("dragging")).toHaveTextContent("idle")
  })
})
