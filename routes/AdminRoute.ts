import express, {
  NextFunction,
  Request,
  Response,
} from 'express';

import {
  CreateVandor,
  GetVandorByID,
  GetVanndors,
} from '../controllers/AdminController';

const router = express.Router();
router.post('/vandor',CreateVandor)
router.get("/vandors",GetVanndors)
router.get('/vandor/:id',GetVandorByID)

router.get('/', (req: Request, res: Response, next: NextFunction) => {


    res.json({ message: "Hello from  Admin"})

})

export { router as AdminRoute };