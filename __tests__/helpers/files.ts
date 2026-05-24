const PDF_HEADER = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34])
const PNG_HEADER = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
])

export function createTestFile(
  name: string,
  type: string,
  sizeBytes = 1024,
): File {
  let content: Uint8Array

  if (type === "application/pdf") {
    content = new Uint8Array(sizeBytes)
    content.set(PDF_HEADER)
  } else if (type === "image/png") {
    content = new Uint8Array(Math.max(sizeBytes, PNG_HEADER.length))
    content.set(PNG_HEADER)
  } else {
    content = new Uint8Array(sizeBytes)
  }

  return new File([content], name, { type })
}

export function asFileList(files: File[]): FileList {
  return Object.assign(files, {
    item: (index: number) => files[index] ?? null,
  }) as FileList
}
