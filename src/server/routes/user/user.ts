import {dbCtrl} from "../../db";
import UserSql from "./users.sql";
import * as nodemailer from "nodemailer";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import {_HASH_} from "../../../../global";
import {verifyToken} from "../login/login";
import {NextFunction, Request, Response} from "express-serve-static-core";

interface IUser {
    insert(req: Request<any, any, any>, res: Response<any>, next: NextFunction) : Promise<any>,
    verifyEmail(req: Request<any, any, any>, res: Response<any>, next: NextFunction) : Promise<any>,
}

class User implements IUser{
    async insert(req: Request<any, any, any>, res: Response<any>, next: NextFunction){

        const {token} = req.params;

        const decoded: any = await verifyToken(token, _HASH_);
        if(!decoded) return;

        const {password, email} = decoded;

        if(!password || !email) return;

        //todo hash password without salt on the frontend
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);

        const result = await dbCtrl.pool.query(UserSql.insert(email, hash, salt));
        if(!result) return res.sendStatus(300);

        return res.redirect("/login")
    }

    async verifyEmail(res, req){
        const {email, password} = req.body;

        const transporter = nodemailer.createTransport({
            host: "mail.privateemail.com",
            port: 465,
            secure: true,
            auth:{
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const token = jwt.sign({email, password}, _HASH_);
        const link = `http://${req.get('host')}/user/${token}`;

        const mailOptions = {
            from: '"Plusnetv" <info@plusnetv.net>', // sender address
            to: email, // list of receivers
            subject: 'Hi! Please verify your email', // Subject line
            html: `<p>Please click on the link to confirm your email <br/><a href=${link}>Click Here!</a></p>`, // plain text body
        };

        try{
            await transporter.sendMail(mailOptions)
        }catch(e){
            return res.status(500).json({status: "error", message: JSON.stringify(e)})
        }

        return res.status(201).json({ status: 'success', message: 'User created' })
    }

    //todo patch -> change password
    //todo delete -> delete user


}

export default new User();

