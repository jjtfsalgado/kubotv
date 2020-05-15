import {dbCtrl} from "../../db";
import ChannelSql from "./channel.sql";
import {NextFunction, Request, Response} from "express-serve-static-core";
import {HttpStatus} from "../../../utils/http_status";
import {IChannelView} from "../../../client/reducers/channel";

interface IChannel {
    get(req: Request<any, any, any>, res: Response<any>, next: NextFunction) : Promise<any>
    insert(req: Request<any, any, any>, res: Response<any>, next: NextFunction) : Promise<any>
    getTotal(req: Request<any, any, any>, res: Response<any>, next: NextFunction) : Promise<any>
    updateFavourites(req: Request<any, any, any>, res: Response<any>, next: NextFunction) : Promise<any>
}

class Channel implements IChannel{
    async get(req: Request<any, any, any>, res: Response<any>, next: NextFunction){
        try{
            const {userId} = req.params;
            const {limit, offset, filter, view} = req.query;
            let v: IChannelView = view;
            const result = await dbCtrl.pool.query(ChannelSql.get(userId, {offset: parseInt(offset), limit: parseInt(limit), filter, isFavourite: v === "favourites", isRecent: v === "new"}));
            if(!result) return res.sendStatus(HttpStatus.ERROR.SERVER.INTERNAL_SERVER_ERROR.code);
            return res.status(HttpStatus.SUCCESSFUL.OK.code).json(result.rows)
        } catch (e) {
            return res.sendStatus(HttpStatus.ERROR.SERVER.INTERNAL_SERVER_ERROR.code);
        }
    }

    async getTotal(req: Request<any, any, any>, res: Response<any>, next: NextFunction){
        try{
            const {userId} = req.params;
            const {filter, view} = req.query;
            let v: IChannelView = view;
            const result = await dbCtrl.pool.query(ChannelSql.getTotal(userId, {filter, isFavourite: v === "favourites", isRecent: v === "new"}));
            if(!result) return res.sendStatus(HttpStatus.ERROR.SERVER.INTERNAL_SERVER_ERROR.code);
            return res.status(HttpStatus.SUCCESSFUL.OK.code).json(result?.rows[0]?.count)
        } catch (e) {
            return res.sendStatus(HttpStatus.ERROR.SERVER.INTERNAL_SERVER_ERROR.code);
        }
    }

    async delete(req: Request<any, any, any>, res: Response<any>, next: NextFunction): Promise<any> {
        const {channelId, userId} = req.params;
        if(!channelId || !userId) return;

        try{
            await dbCtrl.pool.query(ChannelSql.delete(channelId, userId));
            return res.sendStatus(HttpStatus.SUCCESSFUL.CREATED.code);
        } catch (e) {
            return res.sendStatus(HttpStatus.ERROR.SERVER.INTERNAL_SERVER_ERROR.code);
        }
    }

    async deleteView(req: Request<any, any, any>, res: Response<any>, next: NextFunction): Promise<any> {
        const {view, userId} = req.params;

        const v: IChannelView = view;
        if(!userId) return;

        let query;
        if(v === "favourites"){
            query = ChannelSql.deleteFavourites(userId)
        } else if(v === "all"){
            query = ChannelSql.deleteAll(userId);
        } else if (v === "new"){
            query = ChannelSql.deleteRecent(userId)
        }

        try{
            await dbCtrl.pool.query(query);
            return res.sendStatus(HttpStatus.SUCCESSFUL.CREATED.code);
        } catch (e) {
            return res.sendStatus(HttpStatus.ERROR.SERVER.INTERNAL_SERVER_ERROR.code);
        }
    }

    async insert(req: Request<any, any, any>, res: Response<any>, next: NextFunction): Promise<any> {
        const {channels} = req.body;
        try{
            await dbCtrl.pool.query(ChannelSql.insert(channels));
            return res.sendStatus(HttpStatus.SUCCESSFUL.CREATED.code);
        } catch (e) {
            return res.sendStatus(HttpStatus.ERROR.SERVER.INTERNAL_SERVER_ERROR.code);
        }
    }

    async updateFavourites(req: Request<any, any, any>, res: Response<any>, next: NextFunction){
        try{
            const {channels} = req.body;
            await dbCtrl.pool.query(ChannelSql.updateFavourites(channels));
            return res.sendStatus(HttpStatus.SUCCESSFUL.CREATED.code);
        } catch (e) {
            return res.sendStatus(HttpStatus.ERROR.SERVER.INTERNAL_SERVER_ERROR.code);
        }
    }
}

export default new Channel();

