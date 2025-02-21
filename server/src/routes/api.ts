import express from 'express';
import analyze from '../controllers/analyze';

const router = express.Router();

router.post('/analyze', [], analyze);

export default router;