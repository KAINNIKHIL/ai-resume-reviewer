export async function extractTextFromPDF(
  buffer: Buffer
): Promise<string> {
  const pdfParse = require("pdf-parse");

  const data = await pdfParse(buffer);

  return data.text || "";
}

