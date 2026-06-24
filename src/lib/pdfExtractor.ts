if (typeof global !== "undefined") {
  if (!global.DOMMatrix) {
    (global as any).DOMMatrix = class DOMMatrix {};
  }
  if (!global.Path2D) {
    (global as any).Path2D = class Path2D {};
  }
  if (!global.ImageData) {
    (global as any).ImageData = class ImageData {};
  }
}

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const pdfParseRaw = require('pdf-parse');
  const parseFunc = typeof pdfParseRaw === 'function' ? pdfParseRaw : (pdfParseRaw.default || pdfParseRaw);

  const data = await parseFunc(buffer);
  
  const pages = data.text.split('\n\n');
  const formattedText = pages.map((pageText: string, index: number) => {
    return `\n\n--- SLIDE ${index + 1} ---\n\n${pageText.trim()}`;
  }).join('\n');

  const pureText = data.text.trim();
  if (pureText.length < 50) {
    throw new Error("no readable text found. if this is an image-based or scanned PDF, please paste the text directly");
  }

  return formattedText;
}