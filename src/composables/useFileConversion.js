import mammoth from 'mammoth'
import * as XLSX from 'xlsx'
import * as pdfjsLib from 'pdfjs-dist'
import JSZip from 'jszip'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString()

function convertDocx(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const result = await mammoth.convertToMarkdown({ arrayBuffer: e.target.result })
        resolve(result.value)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

function convertExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        let markdown = ''

        workbook.SheetNames.forEach((sheetName, index) => {
          if (index > 0) markdown += '\n\n'
          markdown += `## ${sheetName}\n\n`
          const sheet = workbook.Sheets[sheetName]
          const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1')

          if (sheet['!ref']) {
            const headers = []
            for (let C = range.s.c; C <= range.e.c; C++) {
              const addr = XLSX.utils.encode_cell({ r: range.s.r, c: C })
              headers.push(sheet[addr]?.v || '')
            }
            markdown += '| ' + headers.join(' | ') + ' |\n'
            markdown += '| ' + headers.map(() => '---').join(' | ') + ' |\n'

            for (let R = range.s.r + 1; R <= range.e.r; R++) {
              const row = []
              for (let C = range.s.c; C <= range.e.c; C++) {
                const addr = XLSX.utils.encode_cell({ r: R, c: C })
                row.push(sheet[addr]?.v || '')
              }
              markdown += '| ' + row.join(' | ') + ' |\n'
            }
          }
        })

        resolve(markdown)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

function convertPdf(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const pdf = await pdfjsLib.getDocument({ data: e.target.result }).promise
        let text = ''

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const content = await page.getTextContent()
          const pageText = content.items.map(item => item.str).join(' ')
          text += pageText + '\n\n'
        }

        text = text.replace(/\s+/g, ' ').trim()
        text = text.replace(/^(\S)/gm, '# $1')

        resolve(text || '（无法提取 PDF 文本内容）')
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

function convertPptx(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target.result
        const zip = await JSZip.loadAsync(arrayBuffer)

        const slideFiles = Object.keys(zip.files)
          .filter(name => name.match(/ppt\/slides\/slide\d+\.xml$/))
          .sort()

        let markdown = ''

        for (let i = 0; i < slideFiles.length; i++) {
          const slideContent = await zip.files[slideFiles[i]].async('string')
          const parser = new DOMParser()
          const slideDoc = parser.parseFromString(slideContent, 'text/xml')

          const shapes = slideDoc.querySelectorAll('p\\:sp, p\\:pic')
          let slideText = ''

          shapes.forEach(shape => {
            const textElements = shape.querySelectorAll('a\\:t, t')
            textElements.forEach(t => {
              if (t.textContent.trim()) {
                slideText += t.textContent.trim() + ' '
              }
            })
          })

          if (slideText.trim()) {
            markdown += `## 第 ${i + 1} 页\n\n${slideText.trim()}\n\n`
          }
        }

        resolve(markdown || '（无法提取演示文稿内容）')
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

export function convertFile(file) {
  const ext = file.name.split('.').pop().toLowerCase()

  switch (ext) {
    case 'docx':
      return convertDocx(file)
    case 'xlsx':
    case 'xls':
      return convertExcel(file)
    case 'pdf':
      return convertPdf(file)
    case 'pptx':
      return convertPptx(file)
    default:
      throw new Error('不支持的文件格式')
  }
}
