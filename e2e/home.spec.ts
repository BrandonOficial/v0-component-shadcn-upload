import path from "path"
import { test, expect } from "@playwright/test"

const samplePdf = path.join(__dirname, "fixtures", "sample.pdf")

test.describe("Página inicial — FileUpload", () => {
  test("renderiza o componente de upload", async ({ page }) => {
    await page.goto("/")

    await expect(page.getByRole("heading", { name: "Enviar Arquivo" })).toBeVisible()
    await expect(page.getByText("Arraste os arquivos aqui")).toBeVisible()
  })

  test("seleciona PDF e exibe na lista", async ({ page }) => {
    await page.goto("/")

    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(samplePdf)

    await expect(page.getByText("sample.pdf")).toBeVisible()
    await expect(page.getByRole("button", { name: /fazer upload de 1 arquivo/i })).toBeEnabled()
  })

  test("envia ficheiro via API e limpa a seleção", async ({ page }) => {
    await page.goto("/")

    await page.locator('input[type="file"]').setInputFiles(samplePdf)
    await expect(page.getByText("sample.pdf")).toBeVisible()

    const uploadResponse = page.waitForResponse(
      (res) =>
        res.url().includes("/api/upload") && res.request().method() === "POST",
    )

    await page.getByRole("button", { name: /fazer upload de 1 arquivo/i }).click()

    const response = await uploadResponse
    expect(response.status()).toBe(201)

    await expect(page.getByText("sample.pdf")).not.toBeVisible({ timeout: 10_000 })
  })
})
