import express from 'express';

import {
  CreateVandor,
  GetVandorByID,
  GetVanndors,
} from '../controllers/AdminController';

const router = express.Router();
router.post('/vandor',CreateVandor)
router.get("/vandors",GetVanndors)
router.get('/vandor/:id',GetVandorByID)

export { router as AdminRoute };