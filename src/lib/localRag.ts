/**
 * Local RAG Engine — works WITHOUT any API key.
 * Uses TF-IDF-inspired scoring + passage extraction to find
 * the most relevant content from training data and build answers.
 */

interface ScoredPassage {
  text: string;
  score: number;
  source: string;
}

// ── Tokenize text into lowercase words ─────────────────────
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u0600-\u06FF]/g, ' ') // keep Arabic + alphanumeric
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

// ── Split content into overlapping passages ─────────────────
function splitPassages(text: string, wordsPerPassage = 80, overlap = 20): string[] {
  const words = text.split(/\s+/);
  const passages: string[] = [];
  const step = wordsPerPassage - overlap;

  for (let i = 0; i < words.length; i += step) {
    const chunk = words.slice(i, i + wordsPerPassage).join(' ');
    if (chunk.trim().length > 30) {
      passages.push(chunk.trim());
    }
  }
  return passages;
}

// ── Score a passage against a query ────────────────────────
function scorePassage(passage: string, queryTokens: string[]): number {
  const passageTokens = tokenize(passage);
  const passageSet = new Set(passageTokens);
  let score = 0;

  for (const qt of queryTokens) {
    // Exact match
    if (passageSet.has(qt)) score += 3;
    // Partial match (substring)
    else if (passageTokens.some((t) => t.includes(qt) || qt.includes(t))) score += 1;
  }

  // Bonus for consecutive query words appearing together
  const queryPhrase = queryTokens.join(' ');
  if (passage.toLowerCase().includes(queryPhrase)) score += 10;

  // Normalize by passage length (prefer shorter, focused passages)
  return score / Math.sqrt(passageTokens.length || 1);
}

// ── Main retrieval function ────────────────────────────────
export function retrieveRelevantPassages(
  query: string,
  trainingContext: string,
  topK = 5
): ScoredPassage[] {
  if (!trainingContext || !query.trim()) return [];

  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  // Split context into sections by source marker
  const sections = trainingContext.split(/===.+?===/g).filter(Boolean);
  const sourceLabels = [...trainingContext.matchAll(/===(.+?)===/g)].map((m) => m[1].trim());

  const allPassages: ScoredPassage[] = [];

  sections.forEach((section, idx) => {
    const source = sourceLabels[idx] || 'Knowledge Base';
    const passages = splitPassages(section);

    passages.forEach((p) => {
      const score = scorePassage(p, queryTokens);
      if (score > 0) {
        allPassages.push({ text: p, score, source });
      }
    });
  });

  // Sort by score, deduplicate similar passages, take top K
  const sorted = allPassages
    .sort((a, b) => b.score - a.score)
    .filter((p, i, arr) => i === 0 || !arr.slice(0, i).some((prev) => similarity(prev.text, p.text) > 0.7));

  return sorted.slice(0, topK);
}

// ── Simple text similarity (Jaccard) ──────────────────────
function similarity(a: string, b: string): number {
  const setA = new Set(tokenize(a));
  const setB = new Set(tokenize(b));
  const intersection = [...setA].filter((x) => setB.has(x)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

// ── Generate a local answer from retrieved passages ────────
export function generateLocalAnswer(
  query: string,
  passages: ScoredPassage[],
  botName: string,
  lang: 'ar' | 'en' = 'en'
): string {
  if (passages.length === 0) {
    return lang === 'ar'
      ? `عذراً، لم أجد إجابة لسؤالك في قاعدة المعرفة المتاحة.\n\n**"${query}"**\n\nيمكنك إضافة المزيد من البيانات في صفحة **مصادر البيانات** لتحسين إجاباتي.`
      : `I couldn't find a specific answer to your question in my knowledge base.\n\nYou asked: **"${query}"**\n\nTry adding more training data in **Data Sources** to improve my answers.`;
  }

  const topPassages = passages.slice(0, 3);
  const combined = topPassages.map((p) => p.text).join('\n\n');

  const prefix =
    lang === 'ar'
      ? `بناءً على قاعدة معرفتي:`
      : `Based on my knowledge base:`;

  const suffix =
    lang === 'ar'
      ? `\n\n*💡 للحصول على إجابات أكثر ذكاءً وتفاعلية، أضف مفتاح Gemini API في ملف .env*`
      : `\n\n*💡 For smarter, conversational answers, add a Gemini API key to your .env file — it's free at [aistudio.google.com](https://aistudio.google.com)*`;

  return `${prefix}\n\n${combined}${suffix}`;
}

// ── Detect query language ──────────────────────────────────
export function detectLang(text: string): 'ar' | 'en' {
  const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
  return arabicChars > text.length * 0.2 ? 'ar' : 'en';
}
