/**
 * Gemini AI integration — Maximum quality mode.
 *
 * TWO MODES:
 *  1. LOCAL RAG  — no API key, keyword search from training data
 *  2. GEMINI AI  — full AI with optimized prompts for 98% quality answers
 */

import { retrieveRelevantPassages, generateLocalAnswer, detectLang } from './localRag';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export const hasApiKey = () => Boolean(GEMINI_API_KEY);

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

// ── Main entry point ───────────────────────────────────────
export async function sendMessageToGemini(
  history: GeminiMessage[],
  systemPrompt: string,
  userMessage: string,
  trainingContext?: string
): Promise<string> {
  if (GEMINI_API_KEY) {
    return callGeminiApi(history, systemPrompt, userMessage, trainingContext);
  }
  return localRagResponse(userMessage, systemPrompt, trainingContext);
}

// ── MODE 2: Full Gemini API ────────────────────────────────
async function callGeminiApi(
  history: GeminiMessage[],
  systemPrompt: string,
  userMessage: string,
  trainingContext?: string
): Promise<string> {
  const fullSystemPrompt = buildHighQualitySystemPrompt(systemPrompt, trainingContext);

  const payload = {
    system_instruction: { parts: [{ text: fullSystemPrompt }] },
    contents: [
      ...history.slice(-10), // Keep last 10 messages for context
      { role: 'user', parts: [{ text: userMessage }] },
    ],
    generationConfig: {
      temperature: 0.2,        // Low = factual, precise, accurate
      maxOutputTokens: 2048,
      topP: 0.85,
      topK: 40,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    ],
  };

  try {
    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('❌ Gemini API error:', response.status, err);
      // Show the actual error to user in dev mode
      if (import.meta.env.DEV) {
        const errData = JSON.parse(err || '{}');
        const msg = errData?.error?.message || err;
        return `⚠️ Gemini API Error (${response.status}): ${msg}\n\nالحل: تحقق من صلاحية مفتاح API في ملف .env`;
      }
      return localRagResponse(userMessage, systemPrompt, trainingContext);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return localRagResponse(userMessage, systemPrompt, trainingContext);
    }

    return text;
  } catch (err) {
    console.error('Gemini fetch failed:', err);
    return localRagResponse(userMessage, systemPrompt, trainingContext);
  }
}

// ── Build high-quality system prompt ──────────────────────
function buildHighQualitySystemPrompt(basePrompt: string, trainingContext?: string): string {
  const hasTraining = trainingContext && trainingContext.trim().length > 50;

  const coreBehavior = `
CORE BEHAVIOR:
- Always respond in the SAME LANGUAGE the user used (Arabic → Arabic, English → English).
- Be direct and confident — do not hedge unnecessarily.
- Format answers clearly using markdown: **bold** for key terms, bullet points for lists.
- Keep answers concise but complete — no filler words.
- If the user asks a follow-up question, remember the conversation context.
- Never say "I'm just an AI" or similar disclaimers.
`;

  if (!hasTraining) {
    return `${basePrompt}\n\n${coreBehavior}\n\nNote: No specific knowledge base provided. Answer based on general knowledge.`;
  }

  // Trim to stay well within token limits
  const trimmedContext = trainingContext!.slice(0, 300_000);

  return `${basePrompt}

${coreBehavior}

═══════════════════════════════════════════
KNOWLEDGE BASE (your primary source of truth):
═══════════════════════════════════════════
${trimmedContext}
═══════════════════════════════════════════

STRICT INSTRUCTIONS FOR USING THE KNOWLEDGE BASE:
1. ALWAYS search the knowledge base before answering.
2. If the answer is clearly in the knowledge base → answer precisely from it.
3. If partially in the knowledge base → combine knowledge base info with logical reasoning, but label any additions.
4. If completely absent from the knowledge base → say: "This information is not in my knowledge base. Based on general knowledge: [answer]"
5. NEVER fabricate facts that are not in the knowledge base.
6. Quote exact figures, names, prices, and dates from the knowledge base — accuracy is critical.
7. When answering, you can reformat and rephrase the content naturally — do not copy-paste robotically.
`;
}

// ── MODE 1: Local RAG (no API key) ────────────────────────
async function localRagResponse(
  userMessage: string,
  systemPrompt: string,
  trainingContext?: string
): Promise<string> {
  await new Promise((r) => setTimeout(r, 300 + Math.random() * 200));

  const lang = detectLang(userMessage);
  const lower = userMessage.toLowerCase().trim();

  // Handle greetings
  if (/^(hi|hello|hey|مرحبا|أهلا|السلام عليكم|هاي|مرحبً|أهلاً وسهلاً)[\s!.،]*$/i.test(lower)) {
    const botName = extractBotName(systemPrompt);
    return lang === 'ar'
      ? `مرحباً! 👋 أنا **${botName}**، مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟`
      : `Hello! 👋 I'm **${botName}**, your AI assistant. How can I help you today?`;
  }

  if (/^(شكرا|شكراً|ممنون|شكر|thank you|thanks|thx)[\s!.]*$/i.test(lower)) {
    return lang === 'ar'
      ? 'على الرحب والسعة! 😊 هل هناك شيء آخر يمكنني مساعدتك فيه؟'
      : "You're welcome! 😊 Is there anything else I can help you with?";
  }

  if (trainingContext && trainingContext.length > 50) {
    const passages = retrieveRelevantPassages(userMessage, trainingContext, 5);
    return generateLocalAnswer(userMessage, passages, extractBotName(systemPrompt), lang);
  }

  return lang === 'ar'
    ? `لا توجد بيانات تدريب بعد.\n\nاذهب إلى **مصادر البيانات** وأضف:\n- 📄 ملفات (PDF، TXT...)\n- 🌐 رابط موقع\n- 📝 نص مباشر\n- ❓ أسئلة وأجوبة`
    : `No training data yet.\n\nGo to **Data Sources** and add:\n- 📄 Files (PDF, TXT...)\n- 🌐 Website URL\n- 📝 Custom text\n- ❓ Q&A pairs`;
}

function extractBotName(systemPrompt: string): string {
  const match = systemPrompt.match(/named? "?([^".،]+)"?/i);
  return match?.[1]?.trim() || 'Assistant';
}
