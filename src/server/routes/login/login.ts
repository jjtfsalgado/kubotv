import {dbCtrl} from "../../db";
import UserSql from "./login.sql";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import {_HASH_, _HEADER_AUTH_} from "../../../../global";
import {NextFunction, Request, Response} from "express-serve-static-core";

export async function verifyToken(token: string, privateKey: string = _HASH_){
    return new Promise((res, rej) => {
        jwt.verify(token, privateKey, (err, decoded) => {
            if(err) return rej(err);
            res(decoded)
        })
    })
}

interface ILogin {
    login(req: Request<any, any, any>, res: Response<any>, next: NextFunction) : Promise<any>,
    logout(req: Request<any, any, any>, res: Response<any>, next: NextFunction) : Promise<any>,
}

class Login implements ILogin{
    async login(req: Request<any, any, any>, res: Response<any>, next: NextFunction){
        const {email, password} = req.body;
        const result = await dbCtrl.pool.query(UserSql.getUserHash(email));
        const {hash} = result.rows[0];
        const isAuthenticated = await bcrypt.compare(password, hash);

        if(!isAuthenticated){
            return res.status(401).json({ status: 'failure', message: 'User unauthorised' })
        }

        const token = await jwt.sign({email, password}, _HASH_);

        res.header(_HEADER_AUTH_, token);

        res.send(200)
    }

    async logout(req: Request<any, any, any>, res: Response<any>, next: NextFunction){
        res.removeHeader(_HEADER_AUTH_);
        res.send(200);
    }
}

export default new Login();