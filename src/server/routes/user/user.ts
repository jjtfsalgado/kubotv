import {dbCtrl} from "../../db";
import UserSql from "./users.sql";
import * as nodemailer from "nodemailer";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import {Router} from "express";


const HASH = process.env.HASH;

function User(router: Router): Router {

    //get user
    router.get('/:token', async (req, res) => {
        const {token} = req.params;

        const decoded: any = jwt.verify(token, HASH);

        const {password, email} = decoded;

        if(!password || !email) return;

        //todo hash password without salt on the frontend
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);

        const result = await dbCtrl.pool.query(UserSql.insert(email, hash, salt));
        if(!result) return res.sendStatus(300);

        return res.redirect("/login")
    });

    //insert user
    router.post('/', async (req, res) => {
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

        const token = jwt.sign({email, password}, HASH);
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
    });

    //todo patch -> change password
    //todo delete -> delete user


    return router;
}

export default User;