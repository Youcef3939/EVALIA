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

  const renderPage = async (pageData: any) => {
    const render_options = {
      normalizeWhitespace: false,
      disableCombineTextItems: false
    };

    return pageData.getTextContent(render_options)
      .then((textContent: any) => {
        let lastY, text = '';
        for (let item of textContent.items) {
          if (lastY == item.transform[5] || !lastY) {
            text += item.str;
          } else {
            text += '\n' + item.str;
          }
          lastY = item.transform[5];
        }
        return `\n\n--- SLIDE ${pageData.pageIndex + 1} ---\n\n${text}`;
      });
  };

  const options = {
    pagerender: renderPage
  };

  const data = await parseFunc(buffer, options);
  return data.text;
}