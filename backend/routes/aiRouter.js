import express from "express";
import { recommendRoom } from '../controllers/aiController.js';

const router = express.Router();

router.post("/recommend-room", recommendRoom);

export default router;
