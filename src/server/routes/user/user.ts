import {dbCtrl} from "../../db";
import UserSql from "./users.sql";
import * as nodemailer from "nodemailer";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import {_HASH_} from "../../../../global";
import {verifyToken} from "../login/login";
import {NextFunction, Request, Response} from "express-serve-static-core";
import {HttpStatus} from "../../../utils/http_status";

interface IUser {
    insert(req: Request<any, any, any>, res: Response<any>, next: NextFunction) : Promise<any>,
    verifyEmail(req: Request<any, any, any>, res: Response<any>, next: NextFunction) : Promise<any>,
}

class User implements IUser{
    async insert(req: Request<any, any, any>, res: Response<any>, next: NextFunction){

        try{
            const {token} = req.params;
            const decoded: any = await verifyToken(token);

            console.log(decoded)
            if(!decoded) {
                return res.sendStatus(HttpStatus.ERROR.CLIENT.UNAUTHORIZED.code);
            };

            const {password, email} = decoded;

            if(!password || !email) {
                return res.sendStatus(HttpStatus.ERROR.CLIENT.UNAUTHORIZED.code);
            };

            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(password, salt);
            await dbCtrl.pool.query(UserSql.insert(email, hash, salt));
        }catch (e) {
            return res.sendStatus(HttpStatus.ERROR.SERVER.INTERNAL_SERVER_ERROR.code);
        }finally {
            res.redirect("/#/login")
        }
    }

    async verifyEmail(req: Request<any, any, any>, res: Response<any>, next: NextFunction){
        const {email, password} = req.body;

        const transporter = nodemailer.createTransport({
            host: "mail.privateemail.com",
            port: 587,
            secure: false,
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
            return res.status(HttpStatus.ERROR.SERVER.INTERNAL_SERVER_ERROR.code).send(`${HttpStatus.ERROR.SERVER.INTERNAL_SERVER_ERROR.message} - ${JSON.stringify(e)}`);
        }

        return res.sendStatus(HttpStatus.SUCCESSFUL.OK.code);
    }

    //todo patch -> change password
    //todo delete -> delete user

}

export default new User();

