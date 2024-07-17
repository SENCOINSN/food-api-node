import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import {
  NextFunction,
  Request,
  Response,
} from 'express';

import {
  CreateCustomerInput,
  EditCustomerProfileInput,
  UserLoginInput,
} from '../dto/Customer.dto';
import { Customer } from '../models';
import {
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  GetUserAuthenticated,
  ValidatePassword,
} from '../utility';
import {
  GenerateOtp,
  onRequestOTP,
  onRequestOTPByEmail,
} from '../utility/NotificationUtility';

export const CustomerSignUp = async (req: Request, res: Response, next: NextFunction) => {

    const customerInputs = plainToClass(CreateCustomerInput, req.body);

    const validationError = await validate(customerInputs, {validationError: { target: true}})

    if(validationError.length > 0){
        return res.status(400).json(validationError);
    }

    const { email, phone, password } = customerInputs;

    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);

    const { otp, expiry } = GenerateOtp();

    const existingCustomer = await Customer.findOne({ email: email});

    console.log("existing customer "+existingCustomer)
    
    if(existingCustomer !==null){
        return res.status(400).json({message: 'Email already exist!'});
    }

    const result = await Customer.create({
        email: email,
        password: userPassword,
        salt: salt,
        phone: phone,
        otp: otp,
        otp_expiry: expiry,
        firstName: '',
        lastName: '',
        address: '',
        verified: false,
        lat: 0,
        lng: 0,
        orders: []
    })

    if(result){
        // send OTP to customer
       // await onRequestOTP(otp, phone);

        await onRequestOTPByEmail(otp,email,res);
        
        //Generate the Signature
        const signature = await GenerateSignature({
            _id: result._id,
            email: result.email,
            verified: result.verified
        })
        // Send the result
        return res.status(201).json({signature, verified: result.verified, email: result.email})

    }

    return res.status(400).json({ msg: 'Error while creating user'});


}

export const CustomerLogin = async (req: Request, res: Response, next: NextFunction) => {

    
    const customerInputs = plainToClass(UserLoginInput, req.body);

    const validationError = await validate(customerInputs, {validationError: { target: true}})

    if(validationError.length > 0){
        return res.status(400).json(validationError);
    }

    const { email, password } = customerInputs;
    const customer = await Customer.findOne({ email: email});
    if(customer){
        const validation = await ValidatePassword(password, customer.password, customer.salt);
        console.log("customer id "+customer._id)
        
        if(validation){

            const signature = await GenerateSignature({
                _id: customer._id,
                email: customer.email,
                verified: customer.verified
            })

            console.log("signature "+JSON.stringify(signature))

            return res.status(200).json({
                signature,
                email: customer.email,
                verified: customer.verified
            })
        }
    }

    return res.json({ msg: 'Error With Signing'});

}

export const CustomerVerify = async (req: Request, res: Response, next: NextFunction) => {


    const { otp } = req.body;
    const customer = await GetUserAuthenticated(req)

    if(customer){
        const profile = await FindCustomer('',customer.email)
        if(profile){
            if(profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()){
                profile.verified = true;

                const updatedCustomerResponse = await profile.save();

                const signature = await GenerateSignature({
                    _id: updatedCustomerResponse._id,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified
                })

                return res.status(200).json({
                    signature,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified
                })
            }
            
        }

    }
}

export const RequestOtp = async (req: Request, res: Response, next: NextFunction) => {

    const customer = await GetUserAuthenticated(req)

    if(customer){

        const profile = await FindCustomer('',customer.email)

        if(profile){
            const { otp, expiry } = GenerateOtp();
            profile.otp = otp;
            profile.otp_expiry = expiry;

            await profile.save();
            const sendCode = await onRequestOTP(otp, profile.phone);

            if (!sendCode) {
                return res.status(400).json({ message: 'Failed to verify your phone number' })
            }

            return res.status(200).json({ message: 'OTP sent to your registered Mobile Number!'})

        }
    }

    return res.status(400).json({ msg: 'Error with Requesting OTP'});
}

export const RequestOTPByEmail = async (req: Request, res: Response, next: NextFunction) => {
  
  const customer = await GetUserAuthenticated(req)
  if(customer){
    const profile = await FindCustomer('',customer.email)
    if(profile){
        const { otp, expiry } = GenerateOtp();
        profile.otp = otp;
        profile.otp_expiry = expiry;

        await profile.save();
        await onRequestOTPByEmail(otp, profile.email,res);

    
    }
   

  }

  return res.status(400).json({ msg: 'Error with Requesting OTP'});

}


export const GetCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {

    const customer = await GetUserAuthenticated(req);
 
    if(customer){
        
        const profile =  await FindCustomer('',customer.email)
        
        if(profile){
             
            return res.status(201).json(profile);
        }

    }
    return res.status(400).json({ msg: 'Error while Fetching Profile'});

}

export const EditCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {


    const customer = await GetUserAuthenticated(req);

    const customerInputs = plainToClass(EditCustomerProfileInput, req.body);

    const validationError = await validate(customerInputs, {validationError: { target: true}})

    if(validationError.length > 0){
        return res.status(400).json(validationError);
    }

    const { firstName, lastName, address } = customerInputs;

    if(customer){
        
        const profile =  await FindCustomer('',customer.email)
        
        if(profile){
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            const result = await profile.save()
            
            return res.status(201).json(result);
        }

    }
    return res.status(400).json({ msg: 'Error while Updating Profile'});

}

export const FindCustomer = async (id: String | undefined, email?: string) => {

    if(email){
        return await Customer.findOne({ email: email})
    }else{
        return await Customer.findById(id);
    }

}
