import { Response } from 'express';
import nodemailer from 'nodemailer';

import {
  PASSWORD_EMAIL,
  USER_EMAIL,
} from '../config';
import { OrderDoc } from '../models';

export const GenerateOtp = () => {

    const otp = Math.floor(10000 + Math.random() * 900000);
    let expiry = new Date()
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000));

    return {otp, expiry};
}

export const onRequestOTP = async(otp: number, toPhoneNumber: string) => {

    try {
        const accountSid = "Your Account SID from TWILIO DASHBOARD";
        const authToken = "YOUR AUTH TOKEN AS I SAID ON VIDEO";
        const client = require('twilio')(accountSid, authToken);
    
        const response = await client.message.create({
            body: `Your OTP is ${otp}`,
            from: 'Your TWILIO PHONE NUMBER YOU CAN GET IT FROM YOUR DASHBOARD',
            to: `recipient_countrycode${toPhoneNumber}` // recipient phone number // Add country before the number
        })
    
        return response;
    } catch (error){
        return false
    }
    
}

export const onRequestOTPByEmail = async(otp: number,email: string,res: Response)=>{
    console.log("user email sended "+USER_EMAIL)
    console.log('email '+email)
    console.log("otp "+otp)
        let config = {
            service: 'gmail',
            auth:{
                user: USER_EMAIL,
                pass: PASSWORD_EMAIL
            }
          }
          let transporter = nodemailer.createTransport(config);
          let message = {
            from : 'seyeadam1@gmail.com',
            to: email,
            subject: 'OTP Envoyé !!!',
            html:`<b>Bonjour</b>, votre code OTP est ${otp}`
       
         };
         transporter.sendMail(message).then((info)=>{
            // return res.status(201).json({
            //     msg:'Email sent',
            //     info: info.messageId,
            //     preview: nodemailer.getTestMessageUrl(info)
            // })
            console.log("Email send succesfully!!")
         }).catch((err)=>{
           console.log(err)
         })

}


export const notifyVendorByEmail = async(currentOrder:OrderDoc,email: string)=>{
    console.log("user email sended "+USER_EMAIL)
    console.log('email '+email)
    console.log("current order "+currentOrder)
        let config = {
            service: 'gmail',
            auth:{
                user: USER_EMAIL,
                pass: PASSWORD_EMAIL
            }
          }
          let transporter = nodemailer.createTransport(config);
          let message = {
            from : 'seyeadam1@gmail.com',
            to: email,
            subject: 'OTP Envoyé !!!',
            html:`<b>Bonjour</b>, une nouvelle commande envoyée: ${currentOrder.orderDate}, identifiant : ${currentOrder.orderId} <br>
               delivery ID ${currentOrder.deliveryId} les commandes : ${currentOrder.items}
            `
       
         };
         transporter.sendMail(message).then((info)=>{
            // return res.status(201).json({
            //     msg:'Email sent',
            //     info: info.messageId,
            //     preview: nodemailer.getTestMessageUrl(info)
            // })
            console.log("Email send succesfully!!")
         }).catch((err)=>{
           console.log(err)
         })

}