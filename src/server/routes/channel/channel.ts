import {dbCtrl} from "../../db";
import ChannelSql from "./channel.sql";
import {NextFunction, Request, Response} from "express-serve-static-core";
import {HttpStatus} from "../../../utils/http_status";

interface IChannel {
    getAll(req: Request<any, any, any>, res: Response<any>, next: NextFunction) : Promise<any>
    insertAll(req: Request<any, any, any>, res: Response<any>, next: NextFunction) : Promise<any>
}

class Channel implements IChannel{
    async getAll(req: Request<any, any, any>, res: Response<any>, next: NextFunction){
        try{
            const {userId} = req.params;
            const result = await dbCtrl.pool.query(ChannelSql.getAll(userId));
            if(!result) return res.sendStatus(HttpStatus.ERROR.SERVER.INTERNAL_SERVER_ERROR.code);

            return res.status(HttpStatus.SUCCESSFUL.OK.code).json(result.rows)
        }catch (e) {
            return res.sendStatus(HttpStatus.ERROR.SERVER.INTERNAL_SERVER_ERROR.code);
        }
    }

    async insertAll(req: Request<any, any, any>, res: Response<any>, next: NextFunction): Promise<any> {
        const {channels} = req.body;
        try{
            await dbCtrl.pool.query(ChannelSql.insertAll(channels));
            return res.sendStatus(HttpStatus.SUCCESSFUL.CREATED.code);
        }catch (e) {
            return res.sendStatus(HttpStatus.ERROR.SERVER.INTERNAL_SERVER_ERROR.code);
        }
    }
}

export default new Channel();

