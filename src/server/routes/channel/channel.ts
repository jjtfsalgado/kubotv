import {dbCtrl} from "../../db";
import ChannelSql from "./channel.sql";
import {NextFunction, Request, Response} from "express-serve-static-core";

interface IChannel {
    getAll(req: Request<any, any, any>, res: Response<any>, next: NextFunction) : Promise<any>,
}

class Channel implements IChannel{
    async getAll(req: Request<any, any, any>, res: Response<any>, next: NextFunction){
        const {userId} = req.params;

        const result = await dbCtrl.pool.query(ChannelSql.getAll(userId));

        console.log("#### channel result -> ", result)

        if(!result) return res.sendStatus(300);

        return res.status(200).json({channels: result.rows})
    }
}

export default new Channel();

