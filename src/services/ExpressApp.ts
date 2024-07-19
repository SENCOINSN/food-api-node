import cors from 'cors';
import express, { Application } from 'express';
import path from 'path';

import {
  AdminRoute,
  CustomerRoute,
  DeliveryRoute,
  VandorRoute,
} from '../routes';
import { ShoppingRoute } from '../routes/ShoppingRoute';

export default async(app: Application) => {

    app.use(express.json());
    app.use(express.urlencoded({ extended: true}))
    
    app.use(express.json());

    app.use(cors())
 
    const imagePath = path.join(__dirname,'./images');
    
    app.use('/images', express.static(imagePath));
    
    app.use('/admin', AdminRoute);
    app.use('/vandor', VandorRoute)
    app.use('/customer', CustomerRoute)
    app.use('/delivery', DeliveryRoute);
    app.use(ShoppingRoute);

    return app;

}