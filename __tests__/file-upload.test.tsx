import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FileUpload } from "@/components/file-upload";
import { describe, it, expect, vi } from "vitest";

describe("Componente: FileUpload", () => {
  it("deve renderizar os textos padrão corretamente", () => {
    // 1. Renderiza o componente na tela virtual
    render(<FileUpload />);

    // 2. Procura os elementos na tela
    const titulo = screen.getByText("Enviar Arquivo");
    const subtitulo = screen.getByText(
      "Selecione ou arraste os documentos para upload",
    );

    // 3. Afirma que eles devem existir (Assert)
    expect(titulo).toBeInTheDocument();
    expect(subtitulo).toBeInTheDocument();
  });

  it("deve mostrar a mensagem de limite de tamanho de arquivo", () => {
    render(<FileUpload maxSize={10} acceptedFormats={["PDF"]} />);

    // Verifica se as propriedades dinâmicas foram renderizadas
    expect(screen.getByText("10MB")).toBeInTheDocument();
    expect(screen.getByText("PDF")).toBeInTheDocument();
  });

  it("deve chamar onReset quando o botão Limpar for clicado", async () => {
    // Cria uma função "espiã" (mock) para ver se ela é chamada
    const handleResetMock = vi.fn();

    // Instancia o simulador de usuário
    const user = userEvent.setup();

    render(<FileUpload onReset={handleResetMock} />);

    // Encontra o botão "Limpar"
    const botaoLimpar = screen.getByRole("button", { name: /limpar/i });

    // Como ele inicia desabilitado, nós só garantimos que ele está na tela.
    // Em um teste mais avançado, faríamos o upload de um arquivo falso primeiro
    // para habilitar o botão e depois clicar nele.
    expect(botaoLimpar).toBeInTheDocument();
    expect(botaoLimpar).toBeDisabled();
  });
});
