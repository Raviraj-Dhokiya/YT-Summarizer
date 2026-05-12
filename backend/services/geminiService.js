import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generates a structured AI summary of a YouTube video transcript.
 * @param {Array} transcript - Array of transcript segment objects
 * @param {string} videoTitle - Title of the YouTube video
 * @returns {Object} Parsed JSON with shortSummary, detailedSummary, keyPoints, sections
 */
export async function generateSummary(transcript, videoTitle) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const transcriptText = transcript.map((t) => t.text).join(' ');
  const truncated = transcriptText.slice(0, 12000);

  const prompt = `You are an expert video summarizer. Analyze this YouTube video transcript and provide a structured analysis.

Video Title: "${videoTitle}"

Transcript:
${truncated}

Respond ONLY with a valid JSON object in this exact format (no markdown, no code blocks):
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

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // Strip markdown code fences if present
  let clean = text.replace(/```json\s*/gi, '').replace(/```/g, '').trim();

  // Extract just the JSON object if there's extra text around it
  const jsonMatch = clean.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    clean = jsonMatch[0];
  }

  // Remove control characters that break JSON parsing
  clean = clean.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, '');

  try {
    return JSON.parse(clean);
  } catch (parseErr) {
    console.error('❌ JSON parse failed. Raw AI response:\n', text.slice(0, 500));
    throw new Error('AI returned invalid JSON: ' + parseErr.message);
  }
}
