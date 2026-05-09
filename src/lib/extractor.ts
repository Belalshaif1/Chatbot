/**
 * File & URL extraction utilities for bot training.
 * All processing is done client-side.
 */

// ── Text extraction from File ──────────────────────────────

export async function extractTextFromFile(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';

  if (['txt', 'md', 'csv', 'json', 'html', 'xml', 'rtf'].includes(ext)) {
    return await readAsText(file);
  }

  if (ext === 'pdf') {
    return await extractPdfText(file);
  }

  // For DOCX, DOC, etc. — fall back to raw text attempt
  try {
    const text = await readAsText(file);
    // If it looks like binary garbage, truncate
    const printable = text.replace(/[^\x20-\x7E\n\r\t\u0600-\u06FF]/g, ' ').replace(/\s{4,}/g, ' ');
    return printable.slice(0, 50000);
  } catch {
    return `[Could not extract text from ${file.name}]`;
  }
}

function readAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('FileReader error'));
    reader.readAsText(file, 'UTF-8');
  });
}

async function extractPdfText(file: File): Promise<string> {
  try {
    // Dynamic import to avoid blocking
    const pdfjsLib = await import('pdfjs-dist');
    // Use CDN worker to avoid bundling issues
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const textChunks: string[] = [];
    const maxPages = Math.min(pdf.numPages, 100); // Cap at 100 pages

    for (let i = 1; i <= maxPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item: any) => item.str).join(' ');
      textChunks.push(`--- Page ${i} ---\n${pageText}`);
    }

    return textChunks.join('\n\n');
  } catch (err) {
    console.warn('PDF extraction failed, falling back to binary read:', err);
    return `[PDF: ${file.name} — ${Math.round(file.size / 1024)}KB — PDF parsing unavailable]`;
  }
}

// ── Text extraction from URL ───────────────────────────────

export async function extractTextFromUrl(url: string): Promise<string> {
  // Try multiple CORS proxies
  const proxies = [
    (u: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(u)}`,
    (u: string) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
  ];

  for (const buildUrl of proxies) {
    try {
      const response = await fetch(buildUrl(url), { signal: AbortSignal.timeout(10000) });
      if (!response.ok) continue;

      const json = await response.json().catch(() => null);
      const html: string = json?.contents ?? (await response.text());

      return cleanHtml(html, url);
    } catch {
      continue;
    }
  }

  // If all proxies fail, return a descriptive placeholder
  return `[Website: ${url}\nContent could not be fetched due to network restrictions. Please paste the text content manually instead.]`;
}

function cleanHtml(html: string, url: string): string {
  // Create a DOM parser to strip HTML tags
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Remove script, style, nav, footer elements
    ['script', 'style', 'nav', 'footer', 'header', 'aside', 'iframe', 'noscript'].forEach(tag => {
      doc.querySelectorAll(tag).forEach(el => el.remove());
    });

    // Extract main content
    const main = doc.querySelector('main, article, [role="main"], .content, #content') || doc.body;
    const text = (main as HTMLElement)?.innerText || main?.textContent || '';

    // Clean up whitespace
    const cleaned = text
      .replace(/\n{4,}/g, '\n\n')
      .replace(/[ \t]{4,}/g, ' ')
      .trim();

    if (cleaned.length < 100) {
      return `[Website: ${url}\nFetched but content too short or empty. Consider pasting the content manually.]`;
    }

    return `Source: ${url}\n\n${cleaned.slice(0, 60000)}`;
  } catch {
    return `[Website: ${url} - content fetched but parsing failed]`;
  }
}

// ── Estimate token count (rough) ─────────────────────────
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
