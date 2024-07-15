import express, {
  NextFunction,
  Request,
  Response,
} from 'express';

import {
  GetVendorProfile,
  UpdateVendorProfile,
  UpdateVendorService,
  VendorLogin,
} from '../controllers/VendorController';
import { Authenticate } from '../middlewares';

const router = express.Router();

router.get('/',(req: Request,res: Response, next: NextFunction)=>{
    res.json({message:'Hello wordl vandor'})
 });

 router.post('/login', VendorLogin);

 router.use(Authenticate)
 router.get('/profile', GetVendorProfile);
 router.patch('/profile', UpdateVendorProfile);
 router.patch('/service', UpdateVendorService);

export { router as VandorRoute };