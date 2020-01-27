import {_HASH_} from "../../../../global";
import {verifyToken} from "../login/login";
import {NextFunction, Request, Response} from "express-serve-static-core";

interface IToken {
    verify(req: Request<any, any, any>, res: Response<any>, next: NextFunction),
}

class Token implements IToken{
    async verify(req: Request<any, any, any>, res: Response<any>, next: NextFunction){
        const {token} = req.params;

        if(!token) return res.status(400);
        const decoded: any = await verifyToken(token, _HASH_);
        return res.status(200).json(!!decoded)
    }
}

export default new Token();

