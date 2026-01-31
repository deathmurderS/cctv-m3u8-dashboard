import express from 'express';
import { 
  getStreams, 
  getStreamById, 
  updateStreamStatus, 
  resetStreamStats,
  getStreamAnalytics 
} from '../services/streamService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const streams = await getStreams();
    res.json(streams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const stream = await getStreamById(req.params.id);
    if (!stream) {
      return res.status(404).json({ error: 'Stream not found' });
    }
    res.json(stream);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update stream status (online/offline)
router.post('/:id/status', async (req, res) => {
  try {
    const { status, errorMessage } = req.body;
    const stream = await updateStreamStatus(req.params.id, status, errorMessage);
    if (!stream) {
      return res.status(404).json({ error: 'Stream not found' });
    }
    res.json(stream);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reset stream statistics
router.post('/:id/reset', async (req, res) => {
  try {
    const stream = await resetStreamStats(req.params.id);
    if (!stream) {
      return res.status(404).json({ error: 'Stream not found' });
    }
    res.json(stream);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get analytics data
router.get('/:id/analytics', async (req, res) => {
  try {
    const analytics = await getStreamAnalytics(req.params.id);
    if (!analytics) {
      return res.status(404).json({ error: 'Stream not found' });
    }
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;