export function pickFile(accept: string): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept
    input.style.display = 'none'
    const finish = (file: File | null) => {
      input.remove()
      resolve(file)
    }
    input.onchange = () => finish(input.files?.[0] ?? null)
    input.oncancel = () => finish(null)
    // Keep the input in the DOM while the picker is open: iOS Safari can
    // garbage-collect a detached input, and change never fires
    document.body.appendChild(input)
    input.click()
  })
}

export function downloadBlob(blob: Blob, fileName: string) {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
}

export function downloadJson(data: unknown, fileName: string) {
  downloadBlob(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), fileName)
}
