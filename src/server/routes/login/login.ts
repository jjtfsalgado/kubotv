import {dbCtrl} from "../../db";
import LoginSql from "./login.sql";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import {_HASH_, _HEADER_AUTH_} from "../../../../global";
import {NextFunction, Request, Response} from "express-serve-static-core";
import {HttpStatus} from "../../../utils/http_status";

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
        try{
            const result = await dbCtrl.pool.query(LoginSql.getUserHash(email));
            const user = result && result.rows[0];

            if(!user){
                return res.sendStatus(HttpStatus.ERROR.CLIENT.BAD_REQUEST.code);
            }

            const {hash, id} = user;
            const isAuthenticated = await bcrypt.compare(password, hash);

            if(!isAuthenticated){
                return res.sendStatus(HttpStatus.ERROR.CLIENT.UNAUTHORIZED.code);
            }

            const token = await jwt.sign({email, password}, _HASH_);

            res.header(_HEADER_AUTH_, token);
            res.sendStatus(HttpStatus.SUCCESSFUL.OK.code).json({UserId: id});
        }catch (e) {
            return res.sendStatus(HttpStatus.ERROR.CLIENT.UNAUTHORIZED.code)
        }
    }

    async logout(req: Request<any, any, any>, res: Response<any>, next: NextFunction){
        res.removeHeader(_HEADER_AUTH_);
        res.sendStatus(HttpStatus.SUCCESSFUL.OK.code);
    }
}

export default new Login();
