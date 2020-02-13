import {dbCtrl} from "../../db";
import LoginSql from "./login.sql";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import {_HASH_, _HEADER_AUTH_} from "../../../../global";
import {NextFunction, Request, Response} from "express-serve-static-core";

export async function verifyToken(token: string, privateKey: string = _HASH_){
    return new Promise((res, rej) => {
        jwt.verify(token, privateKey, (err, decoded) => {
            if(err) {
                console.error("jwt couldn't verify -> ", err);
                return rej(err);
            };
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
        let result;
        try{
            result = await dbCtrl.pool.query(LoginSql.getUserHash(email));
        }catch (e) {
            return res.status(401).json({ status: 'failure', message: 'User unauthorised' })
        }

        const {hash, id} = result.rows[0];
        const isAuthenticated = await bcrypt.compare(password, hash);

        if(!isAuthenticated){
            return res.status(401).json({ status: 'failure', message: 'User unauthorised' })
        }

        const token = await jwt.sign({email, password}, _HASH_);

        res.header(_HEADER_AUTH_, token);

        res.status(200).json({UserId: id});
    }

    async logout(req: Request<any, any, any>, res: Response<any>, next: NextFunction){
        res.removeHeader(_HEADER_AUTH_);
        res.sendStatus(200);
    }
}

export default new Login();