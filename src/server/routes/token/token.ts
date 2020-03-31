import {_HASH_} from "../../../../global";
import {verifyToken} from "../login/login";
import {NextFunction, Request, Response} from "express-serve-static-core";
import {HttpStatus} from "../../../utils/http_status";

interface IToken {
    verify(req: Request<any, any, any>, res: Response<any>, next: NextFunction),
}

class Token implements IToken{
    async verify(req: Request<any, any, any>, res: Response<any>, next: NextFunction){
        try{
            const {token} = req.params;
            if(!token) return res.sendStatus(HttpStatus.ERROR.CLIENT.UNAUTHORIZED.code);
            const decoded: any = await verifyToken(token, _HASH_);
            return res.status(HttpStatus.SUCCESSFUL.OK.code).json(!!decoded)
        }catch (e) {
            return res.sendStatus(HttpStatus.ERROR.CLIENT.UNAUTHORIZED.code);
        }
    }
}

export default new Token();

