import {
  NextFunction,
  Request,
  Response,
} from 'express';

import {
  EditVendorInput,
  VendorLoginInput,
} from '../dto';
import {
  GenerateSignature,
  GetUserAuthenticated,
  ValidatePassword,
} from '../utility';
import { FindVendor } from './AdminController';

export const VendorLogin = async (req: Request,res: Response, next: NextFunction) => {

    const { email, password } = <VendorLoginInput>req.body;

    const existingUser = await FindVendor('', email);

    if(existingUser !== null){

        const validation = await ValidatePassword(password, existingUser.password, existingUser.salt);
        if(validation){

            const signature = await GenerateSignature({
                _id: existingUser._id,
                email: existingUser.email,
                name: existingUser.name
            })
            return res.json(signature);
        }
    }

    return res.json({'message': 'Login credential is not valid'})

}

export const GetVendorProfile = async (req: Request,res: Response, next: NextFunction) => {

    //const user = req.user;
    //const signature = req.get('Authorization')

   // const payload = await jwt.verify(signature!.split(' ')[1], APP_SECRET) as AuthPayload; 
    //let user: AuthPayload = payload;

    const user =await GetUserAuthenticated(req);
    if(user){
       const existingVendor = await FindVendor('',user.email);
       return res.json(existingVendor);
    }

    return res.json({'message': 'vendor Information Not Found'})
}

export const UpdateVendorProfile = async (req: Request,res: Response, next: NextFunction) => {

    const user = await GetUserAuthenticated(req);

    const { foodType, name, address, phone} = <EditVendorInput>req.body;
     
    if(user){

       const existingVendor = await FindVendor('',user.email);

       if(existingVendor !== null){

            existingVendor.name = name;
            existingVendor.address=address;
            existingVendor.phone = phone;
            existingVendor.foodType = foodType;
            const saveResult = await existingVendor.save();

            return res.json(saveResult);
       }

    }
    return res.json({'message': 'Unable to Update vendor profile '})

}

export const UpdateVendorService = async (req: Request,res: Response, next: NextFunction) => {

    const user = await GetUserAuthenticated(req)

    const { lat, lng} = req.body;
     
    if(user){

       const existingVendor = await FindVendor('',user.email);

       if(existingVendor !== null){

            existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
            if(lat && lng){
                existingVendor.lat = lat;
                existingVendor.lng = lng;
            }
            const saveResult = await existingVendor.save();

            return res.json(saveResult);
       }

    }
    return res.json({'message': 'Unable to Update vendor profile '})

}
