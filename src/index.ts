/*import bodyParser from 'body-parser';
import express from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import path from 'path';

import { MONGO_URI } from './config';
import {
  AdminRoute,
  VandorRoute,
} from './routes';

const app= express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
    
app.use('/images', express.static(path.join(__dirname,'images')));
 
 app.use('/admin',AdminRoute)
 app.use('/vandor',VandorRoute)

 mongoose.connect(MONGO_URI, {
    
  } as ConnectOptions).then(result=>{
    console.log("db connected ")

  }).catch(err=>console.log("Error ",err))



 app.listen(8000,()=>{
    console.log("app is listening on port 8000")
 })*/

import express from 'express';

import { PORT } from './config';
import dbConnection from './services/Database';
import App from './services/ExpressApp';

const StartServer = async ()=> {

    const app = express();

    await dbConnection();

    await App(app);

    app.listen(PORT,()=>{
        console.log("app is listening on port 8000")
     }) 
}

StartServer();