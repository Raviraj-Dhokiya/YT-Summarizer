/**
 * Generates a structured AI summary of a YouTube video transcript.
 * Uses native fetch to call the Gemini REST API directly (v1 endpoint).
 *
 * @param {Array} transcript - Array of transcript segment objects
 * @param {string} videoTitle - Title of the YouTube video
 * @returns {Object} Parsed JSON with shortSummary, detailedSummary, keyPoints, sections
 */
export async function generateSummary(transcript, videoTitle) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set in environment variables.');

  const model = 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;

  const transcriptText = transcript.map((t) => t.text).join(' ');
  const truncated = transcriptText.slice(0, 12000);

  const prompt = `You are an expert video summarizer. Analyze this YouTube video transcript and return ONLY a raw JSON object — no markdown, no code fences, no explanation text before or after.

Video Title: "${videoTitle}"

Transcript:
${truncated}

Return this exact JSON structure:
{
  "shortSummary": "2-3 sentence overview of the entire video",
  "detailedSummary": "Comprehensive paragraph (150-200 words) covering all main topics discussed",
  "keyPoints": [
    "Key point 1",
    "Key point 2",
    "Key point 3",
    "Key point 4",
    "Key point 5"
  ],
  "sections": [
    {"title": "Section name", "approximateStartPercent": 0},
    {"title": "Section name", "approximateStartPercent": 20},
    {"title": "Section name", "approximateStartPercent": 45},
    {"title": "Section name", "approximateStartPercent": 70},
    {"title": "Section name", "approximateStartPercent": 90}
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
