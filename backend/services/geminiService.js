/**
 * Generates a structured AI summary of a YouTube video transcript.
 * Uses native fetch to call the Gemini REST API directly (v1 endpoint).
 *
 * @param {Array} transcript - Array of transcript segment objects
 * @param {string} videoTitle - Title of the YouTube video
 * @returns {Object} Parsed JSON with shortSummary, detailedSummary, keyPoints, sections
 */
export async function generateSummary(transcript, videoTitle, language = 'English') {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set in environment variables.');

  const model = 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;

  const transcriptText = transcript.map((t) => t.text).join(' ');
  const truncated = transcriptText.slice(0, 12000);

  const prompt = `You are an expert video summarizer. Analyze this YouTube video transcript and return ONLY a raw JSON object — no markdown, no code fences, no explanation text before or after.

IMPORTANT: Write ALL text values (shortSummary, detailedSummary, keyPoints, and section titles) in "${language}" language.

Video Title: "${videoTitle}"

Transcript:
${truncated}

Return this exact JSON structure:
{
  "shortSummary": "2-3 sentence overview of the entire video (in ${language})",
  "detailedSummary": "Comprehensive paragraph (150-200 words) covering all main topics discussed (in ${language})",
  "keyPoints": [
    "Key point 1 (in ${language})",
    "Key point 2 (in ${language})",
    "Key point 3 (in ${language})",
    "Key point 4 (in ${language})",
    "Key point 5 (in ${language})"
  ],
  "sections": [
    {"title": "Section name (in ${language})", "approximateStartPercent": 0},
    {"title": "Section name (in ${language})", "approximateStartPercent": 20},
    {"title": "Section name (in ${language})", "approximateStartPercent": 45},
    {"title": "Section name (in ${language})", "approximateStartPercent": 70},
    {"title": "Section name (in ${language})", "approximateStartPercent": 90}
  ]
}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 4096,
      },
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Gemini API error [${response.status}]: ${errBody}`);
  }

  const data = await response.json();

  // Concatenate all text parts (thinking model may split output into multiple parts)
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  const raw = parts.map((p) => p.text ?? '').join('');
  const text = raw.trim();

  if (!text) {
    console.error('❌ Empty response from Gemini. Full API response:', JSON.stringify(data, null, 2));
    throw new Error('Gemini returned an empty response.');
  }

  // Strip markdown code fences
  let clean = text
    .replace(/```json\s*/gi, '')        // strip ```json fences
    .replace(/```/g, '')                // strip ``` fences
    .trim();

  // Extract just the JSON object in case there's surrounding text
  const jsonMatch = clean.match(/\{[\s\S]*\}/);
  if (jsonMatch) clean = jsonMatch[0];

  // Remove ASCII control characters that break JSON parsing (except \n \r \t)
  clean = clean.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  try {
    return JSON.parse(clean);
  } catch (parseErr) {
    console.error('❌ JSON parse failed. Raw AI response (first 800 chars):\n', text.slice(0, 800));
    throw new Error('AI returned invalid JSON: ' + parseErr.message);
  }
}

/**
 * Chat with a video — answer user questions based on the transcript.
 * @param {Array} transcript - Array of transcript segment objects
 * @param {string} videoTitle - Title of the YouTube video
 * @param {string} question - User's question
 * @param {Array} chatHistory - Previous [{role, content}] messages for context
 * @returns {string} AI answer text
 */
export async function chatWithVideo(transcript, videoTitle, question, chatHistory = []) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set in environment variables.');

  const model = 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;

  const transcriptText = transcript.map((t) => t.text).join(' ');
  const truncated = transcriptText.slice(0, 10000);

  // Build conversation history for context
  const historyText = chatHistory.length > 0
    ? chatHistory.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n')
    : '';

  const systemPrompt = `You are a helpful AI assistant for a YouTube video. Answer questions about the video based ONLY on the transcript provided. Be concise, accurate, and friendly. If the answer is not in the transcript, say so honestly.

Video Title: "${videoTitle}"

Video Transcript:
${truncated}

${historyText ? `Previous conversation:\n${historyText}\n` : ''}User question: ${question}

Answer in the same language the user asked the question in. Be concise (2-4 sentences unless more detail is needed).`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: systemPrompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Gemini API error [${response.status}]: ${errBody}`);
  }

  const data = await response.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  const answer = parts.map((p) => p.text ?? '').join('').trim();

  if (!answer) throw new Error('Gemini returned an empty response.');
  return answer;
}
