import {dbCtrl} from "../../db";
import ChannelSql from "./channel.sql";
import {NextFunction, Request, Response} from "express-serve-static-core";

interface IChannel {
    getAll(req: Request<any, any, any>, res: Response<any>, next: NextFunction) : Promise<any>
    insertAll(req: Request<any, any, any>, res: Response<any>, next: NextFunction) : Promise<any>
}

class Channel implements IChannel{
    async getAll(req: Request<any, any, any>, res: Response<any>, next: NextFunction){
        //fixme this shouldnt be on the parameters but on the payload of a post request
        const {userId} = req.params;

        const result = await dbCtrl.pool.query(ChannelSql.getAll(userId));

        if(!result) return res.sendStatus(300);

        return res.status(200).json({channels: result.rows})
    }

    async insertAll(req: Request<any, any, any>, res: Response<any>, next: NextFunction): Promise<any> {
        const {channels} = req.body;
        console.log(channels);

        const result = await dbCtrl.pool.query(ChannelSql.insertAll(channels));

        if(!result) return res.sendStatus(300);

        return res.status(200);
    }
}

export default new Channel();

