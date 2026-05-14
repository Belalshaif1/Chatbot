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
    .filter((w) => w.length > 1);
}

// ── Skeleton (Soundex-like) Matching for Cross-Language ──
function transliterate(text: string): string {
  const map: Record<string, string> = {
    'ا': '', 'أ': '', 'إ': '', 'آ': '', 'ب': 'b', 'ت': 't', 'ث': 'th',
    'ج': 'j', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'th', 'ر': 'r', 'ز': 'z',
    'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a',
    'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
    'ه': 'h', 'و': 'w', 'ي': 'y', 'ى': '', 'ة': 't', 'ئ': '', 'ؤ': ''
  };
  return text.toLowerCase().split('').map(c => map[c] || c).join('').replace(/[aeiou\s]/g, '');
}

// ── Split content into overlapping passages ─────────────────
function splitPassages(text: string, wordsPerPassage = 50, overlap = 25): string[] {
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

// ── Bilingual Bridge (Small common mapping for Local Search) ──
const BILINGUAL_MAP: Record<string, string> = {
  'manager': 'مدير', 'boss': 'مدير', 'office': 'مكتب', 'work': 'عمل',
  'hello': 'مرحبا', 'help': 'مساعدة', 'price': 'سعر', 'cost': 'تكلفة',
  'location': 'موقع', 'address': 'عنوان', 'phone': 'هاتف', 'email': 'ايميل'
};

function scorePassage(passage: string, queryTokens: string[]): number {
  const pTokens = tokenize(passage);
  const pText = passage.toLowerCase();
  let score = 0;

  queryTokens.forEach((qt) => {
    const tQt = transliterate(qt);
    
    // 1. Exact Match
    if (pTokens.includes(qt)) {
      score += 5;
    } 
    // 2. Skeleton/Phonetic Match (Works for Bilal/بلال -> BLL)
    else if (tQt.length > 1) {
      if (pTokens.some(pt => {
        const tPt = transliterate(pt);
        return tPt === tQt || (tPt.length > 1 && (tPt.includes(tQt) || tQt.includes(tPt)));
      })) {
        score += 5; 
      }
    }
    
    // 3. Bilingual Bridge Match
    const translated = BILINGUAL_MAP[qt] || Object.keys(BILINGUAL_MAP).find(k => BILINGUAL_MAP[k] === qt);
    if (translated && pTokens.includes(translated)) {
      score += 4;
    }
  });

  // PHRASE MATCHING
  const queryPhrase = queryTokens.join(' ');
  if (pText.includes(queryPhrase)) score += 20;

  // Length normalization
  return score / Math.log10(pTokens.length + 10);
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
  lang: 'ar' | 'en' = 'en'
): string {
  if (passages.length === 0) {
    return lang === 'ar'
      ? `عذراً، لم أجد إجابة لسؤالك في قاعدة المعرفة المتاحة.\n\n**"${query}"**\n\nيرجى التأكد من أن سؤالك باللغة نفسها الموجودة في الملفات المرفوعة، أو قم بإضافة المزيد من البيانات لتحسين النتائج.`
      : `I couldn't find a specific answer to your question in my knowledge base.\n\nYou asked: **"${query}"**\n\nPlease ensure your question is in the same language as the uploaded files, or add more data to improve results.`;
  }

  const topPassages = passages.slice(0, 3);
  
  const intros = lang === 'ar' 
    ? [
        `بالطبع! لقد قرأت الملفات المرفوعة ووجدت لك هذه المعلومات:`,
        `تفضل يا صديقي، إليك ما وجدته بخصوص سؤالك:`,
        `أهلاً بك! إليك الإجابة التي بحثت عنها في الملفات:`
      ]
    : [
        `Sure! I've looked through the files and found this for you:`,
        `Here you go! Based on the documents, this is what I found:`,
        `Hello! I've checked the information for you, here is the answer:`
      ];

  const intro = intros[Math.floor(Math.random() * intros.length)];

  const combined = topPassages.map((p, idx) => {
    const prefix = lang === 'ar' ? (idx === 0 ? "أولاً، " : "أيضاً، ") : (idx === 0 ? "First, " : "Also, ");
    return `${prefix}${p.text}`;
  }).join('\n\n');

  const closings = lang === 'ar'
    ? [
        `أتمنى أن تكون هذه الإجابة مفيدة لك! هل تريد معرفة أي شيء آخر؟`,
        `هذا كل ما وجدته في الملفات حالياً، هل لديك سؤال آخر؟`,
        `أنا هنا للمساعدة دائماً، هل تريدني أن أبحث عن تفاصيل إضافية؟`
      ]
    : [
        `I hope this helps! Do you want to know anything else?`,
        `That's what I found in the documents. Anything else I can help with?`,
        `I'm always here to help. Should I look for more details?`
      ];

  const closing = closings[Math.floor(Math.random() * closings.length)];

  return `${intro}\n\n${combined}\n\n${closing}`;
}

// ── Detect query language ──────────────────────────────────
export function detectLang(text: string): 'ar' | 'en' {
  const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
  return arabicChars > text.length * 0.2 ? 'ar' : 'en';
}
