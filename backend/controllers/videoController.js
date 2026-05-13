import { YoutubeTranscript } from 'youtube-transcript';
import Video from '../models/Video.js';
import { generateSummary, chatWithVideo } from '../services/geminiService.js';
import { extractVideoId } from '../utils/extractVideoId.js';
import { formatTime } from '../utils/formatTime.js';

// POST /api/summarize
export const summarizeVideo = async (req, res) => {
  try {
    const { url, language = 'English' } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    const videoId = extractVideoId(url);
    if (!videoId) return res.status(400).json({ error: 'Invalid YouTube URL' });

    // Check MongoDB cache — only return if SAME language was already processed
    const existing = await Video.findOne({ videoId, language });
    if (existing) {
      return res.json({ success: true, data: existing, cached: true });
    }

    // Fetch transcript from YouTube
    let transcript;
    try {
      transcript = await YoutubeTranscript.fetchTranscript(videoId);
    } catch (err) {
      return res.status(422).json({
        error: 'Could not fetch transcript. The video may have no captions or be restricted.',
      });
    }

    if (!transcript || transcript.length === 0) {
      return res.status(422).json({ error: 'No transcript available for this video.' });
    }

    // Fetch video title and thumbnail via YouTube oEmbed
    let title = 'YouTube Video';
    let thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    try {
      const oembedRes = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
      );
      if (oembedRes.ok) {
        const oembedData = await oembedRes.json();
        title = oembedData.title || title;
        thumbnail = oembedData.thumbnail_url || thumbnail;
      }
    } catch (_) {}

    // Generate AI summary via Gemini
    let aiResult;
    try {
      aiResult = await generateSummary(transcript, title, language);
    } catch (err) {
      return res.status(500).json({ error: 'AI summary generation failed: ' + err.message });
    }

    // Map section percentages → actual timestamps from transcript
    const totalDuration = transcript[transcript.length - 1].offset / 1000;
    const timestamps = (aiResult.sections || []).map((section) => {
      const targetSeconds = (section.approximateStartPercent / 100) * totalDuration;
      const closest = transcript.reduce((prev, curr) => {
        return Math.abs(curr.offset / 1000 - targetSeconds) <
          Math.abs(prev.offset / 1000 - targetSeconds)
          ? curr
          : prev;
      });
      const seconds = Math.floor(closest.offset / 1000);
      return { time: formatTime(seconds), seconds, title: section.title };
    });

    // Save to MongoDB (keyed by videoId + language)
    const video = new Video({
      videoId,
      language,
      url,
      title,
      thumbnail,
      shortSummary: aiResult.shortSummary,
      detailedSummary: aiResult.detailedSummary,
      keyPoints: aiResult.keyPoints || [],
      timestamps,
    });
    await video.save();

    return res.json({ success: true, data: video, cached: false });
  } catch (err) {
    console.error('❌ summarizeVideo error:', err);
    res.status(500).json({ error: 'Internal server error: ' + err.message });
  }
};

// GET /api/history
export const getHistory = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, data: videos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/history/:videoId
export const deleteVideo = async (req, res) => {
  try {
    await Video.deleteOne({ videoId: req.params.videoId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/chat
export const chatWithVideoController = async (req, res) => {
  try {
    const { videoId, question, chatHistory = [] } = req.body;
    if (!videoId || !question) {
      return res.status(400).json({ error: 'videoId and question are required' });
    }

    // Get video title from DB for context
    const video = await Video.findOne({ videoId });
    const videoTitle = video?.title || 'YouTube Video';

    // Fetch fresh transcript for chat context
    let transcript;
    try {
      transcript = await YoutubeTranscript.fetchTranscript(videoId);
    } catch (err) {
      return res.status(422).json({ error: 'Could not fetch transcript for this video.' });
    }

    const answer = await chatWithVideo(transcript, videoTitle, question, chatHistory);
    return res.json({ success: true, answer });
  } catch (err) {
    console.error('❌ chatWithVideo error:', err);
    res.status(500).json({ error: 'Chat failed: ' + err.message });
  }
};
