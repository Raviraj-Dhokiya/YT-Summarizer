import express from 'express';
import {
  summarizeVideo,
  getHistory,
  deleteVideo,
} from '../controllers/videoController.js';

const router = express.Router();

router.post('/summarize', summarizeVideo);
router.get('/history', getHistory);
router.delete('/history/:videoId', deleteVideo);

export default router;
