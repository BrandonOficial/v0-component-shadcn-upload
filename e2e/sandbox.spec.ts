import path from "path"
import { test, expect, type Page } from "@playwright/test"

const samplePdf = path.join(__dirname, "fixtures", "sample.pdf")

async function selectPdfInUploadArea(page: Page) {
  const fileChooserPromise = page.waitForEvent("filechooser")
  await page
    .getByRole("button", { name: /área de upload/i })
    .click()
  const fileChooser = await fileChooserPromise
  await fileChooser.setFiles(samplePdf)
  await expect(page.getByText("sample.pdf")).toBeVisible()
}

test.describe("Sandbox — formulário + API", () => {
  test("renderiza playground com react-hook-form", async ({ page }) => {
    await page.goto("/sandbox")

    await expect(
      page.getByRole("heading", { name: "Playground de Upload" }),
    ).toBeVisible()
    await expect(page.getByText("Documentos Pessoais")).toBeVisible()
    await expect(page.getByRole("button", { name: "Enviar para API" })).toBeVisible()
  })

  test("submete documento para a API", async ({ page }) => {
    await page.goto("/sandbox")

    await selectPdfInUploadArea(page)

    const uploadResponse = page.waitForResponse(
      (res) =>
        res.url().includes("/api/upload") && res.request().method() === "POST",
    )

    await page.getByRole("button", { name: "Enviar para API" }).click()

    const response = await uploadResponse
    expect(response.status()).toBe(201)

    const body = await response.json()
    expect(body.message).toMatch(/sucesso/i)
    expect(body.files?.[0]?.url).toMatch(/^\/uploads\//)

    await expect(page.getByText("sample.pdf")).not.toBeVisible({ timeout: 10_000 })
  })
})
