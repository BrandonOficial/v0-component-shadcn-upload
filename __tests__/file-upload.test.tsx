import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { FileUpload } from "@/components/file-upload"
import { describe, it, expect, vi } from "vitest"
import { useState } from "react"
import { createTestFile, asFileList } from "./helpers/files"

function ControlledFileUpload(props: {
  onReset?: () => void
  onUpload?: (files: File[]) => void
  maxSize?: number
  maxFiles?: number
  acceptedFormats?: ("PDF" | "PNG")[]
}) {
  const [files, setFiles] = useState<File[]>([])
  return (
    <FileUpload
      files={files}
      onFileSelect={setFiles}
      onReset={props.onReset}
      onUpload={props.onUpload}
      maxSize={props.maxSize}
      maxFiles={props.maxFiles}
      acceptedFormats={props.acceptedFormats}
    />
  )
}

describe("Componente: FileUpload", () => {
  it("deve renderizar os textos padrão corretamente", () => {
    render(<FileUpload />)

    expect(screen.getByText("Enviar Arquivo")).toBeInTheDocument()
    expect(
      screen.getByText("Selecione ou arraste os documentos para upload"),
    ).toBeInTheDocument()
    expect(screen.getByText("Arraste os arquivos aqui")).toBeInTheDocument()
  })

  it("deve mostrar a mensagem de limite de tamanho de arquivo", () => {
    render(<FileUpload maxSize={10} acceptedFormats={["PDF"]} />)

    expect(screen.getByText("10MB")).toBeInTheDocument()
    expect(screen.getByText("PDF")).toBeInTheDocument()
  })

  it("exibe limite de quantidade quando maxFiles está definido", () => {
    render(<FileUpload maxFiles={3} acceptedFormats={["PDF"]} />)

    expect(screen.getByText(/máx\. 3 arquivo/i)).toBeInTheDocument()
  })

  it("deve chamar onReset quando o botão Limpar for clicado", async () => {
    const handleResetMock = vi.fn()
    const user = userEvent.setup()

    render(
      <ControlledFileUpload
        onReset={handleResetMock}
        acceptedFormats={["PDF"]}
        maxSize={10}
      />,
    )

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement
    await user.upload(input, createTestFile("teste.pdf", "application/pdf"))

    expect(screen.getByText("teste.pdf")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: /limpar/i }))

    expect(handleResetMock).toHaveBeenCalledTimes(1)
    expect(screen.queryByText("teste.pdf")).not.toBeInTheDocument()
  })

  it("exibe erro de validação na tela", () => {
    render(<FileUpload acceptedFormats={["PDF"]} maxSize={10} />)

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement

    fireEvent.change(input, {
      target: {
        files: asFileList([
          createTestFile("falso.pdf", "image/png"),
        ]),
      },
    })

    const alert = screen.getByRole("alert")
    expect(alert.textContent).toMatch(/Tipo de arquivo inválido/)
  })

  it("chama onUpload com os arquivos selecionados", async () => {
    const onUpload = vi.fn()
    const user = userEvent.setup()

    render(
      <ControlledFileUpload
        onUpload={onUpload}
        acceptedFormats={["PDF"]}
        maxSize={10}
      />,
    )

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement
    await user.upload(input, createTestFile("enviar.pdf", "application/pdf"))
    await user.click(screen.getByRole("button", { name: /fazer upload/i }))

    expect(onUpload).toHaveBeenCalledTimes(1)
    expect(onUpload.mock.calls[0][0]).toHaveLength(1)
    expect(onUpload.mock.calls[0][0][0].name).toBe("enviar.pdf")
  })

  it("aplica labels customizados", () => {
    render(
      <FileUpload
        labels={{
          title: "Anexos",
          clear: "Apagar tudo",
        }}
      />,
    )

    expect(screen.getByText("Anexos")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /apagar tudo/i })).toBeInTheDocument()
  })

  it("não deve exibir botão Enviar quando showUploadButton é false", () => {
    render(<FileUpload showUploadButton={false} />)

    expect(
      screen.queryByRole("button", { name: /fazer upload/i }),
    ).not.toBeInTheDocument()
  })

  it("sincroniza lista quando files do pai é esvaziado (modo controlado)", () => {
    const { rerender } = render(
      <FileUpload
        files={[createTestFile("a.pdf", "application/pdf")]}
        onFileSelect={vi.fn()}
      />,
    )

    expect(screen.getByText("a.pdf")).toBeInTheDocument()

    rerender(<FileUpload files={[]} onFileSelect={vi.fn()} />)

    expect(screen.queryByText("a.pdf")).not.toBeInTheDocument()
  })
})
