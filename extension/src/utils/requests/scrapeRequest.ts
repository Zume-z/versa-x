import { DomNode, RecursiveCallback, convert } from 'html-to-text'
import { BlockTextBuilder } from 'html-to-text/lib/block-text-builder'

// Limit text length of body
const textLimiter = (text: string) => {
  if (text.length > 40000) {
    text = text.slice(0, 40000)
  }
  return text
}

export const scrapePage = () => {
  const documentTitle = document.title
  const documentUrl = document.URL
  const documentAsString = new XMLSerializer().serializeToString(document)

  const options = {
    trimEmptyLines: true,
    formatters: {
      anchor: (elem: DomNode, walk: RecursiveCallback, builder: BlockTextBuilder) => {
        walk(elem.children, builder)
      },
      image: (elem: DomNode, walk: RecursiveCallback, builder: BlockTextBuilder) => {
        walk(elem.children, builder)
      },
    },
  }

  const htmlToString = convert(documentAsString, options)

  const cleanText = (text: string) => {
    // if page is Twitter (remove JS error)
    if (document.URL.includes('twitter.com')) {
      text = text.slice(1950)
    }
    // if page is Gmail (remove JS error)
    if (document.URL.includes('mail.google.com')) {
      text = text.slice(1100)
    }

    return text
      .trim()
      .replace(/\*/g, '')
      .replace(/▼/g, '')
      .replace(/▲/g, '')
      .replace(/▶/g, '')
      .replace(/◀/g, '')
      .replace(/•/g, '')
      .replace(/--/g, '')
      .replace(/(\n){4,}/g, '\n\n\n')
      .replace(/(\n){4,}/g, '\n\n')
      .replace(/ {3,}/g, '  ')
      .replace(/\t/g, '')
      .replace(/\n+(\s*\n)*/g, '\n')
      .trim()
  }

  const body = cleanText(htmlToString)

  const docData = { title: documentTitle, url: documentUrl, body: textLimiter(body) }
  // console.log('TITLE: ', docData.title)
  // console.log('BODY: ', docData.url)
  // console.log('CONTENT: ', docData.body)
  return docData
}
