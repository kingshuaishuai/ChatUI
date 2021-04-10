export default function parseDataTransfer(e: ClipboardEvent, callback: (file: File) => void) {
  const { items } = e.clipboardData || { items: [] }
  if (items && items.length) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i]

      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile()
        if (file) {
          callback(file)
        }
        e.preventDefault()
        break
      }
    }
  }
}
