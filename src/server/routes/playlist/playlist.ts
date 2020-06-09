import {dbCtrl} from "../../db";
import PlaylistSql from "./playlist.sql";
import {NextFunction, Request, Response} from "express-serve-static-core";
import {HttpStatus} from "../../../utils/http_status";

interface IPlaylist {
    get(req: Request<any, any, any>, res: Response<any>, next: NextFunction) : Promise<any>
    // insert(req: Request<any, any, any>, res: Response<any>, next: NextFunction) : Promise<any>
    // getTotal(req: Request<any, any, any>, res: Response<any>, next: NextFunction) : Promise<any>
}

class Playlist implements IPlaylist{
    async get(req: Request<any, any, any>, res: Response<any>, next: NextFunction){
        try{
            const {userId} = req.params;
            const {filter} = req.query;
            const result = await dbCtrl.pool.query(PlaylistSql.get(userId, {filter}));
            if(!result) return res.sendStatus(HttpStatus.ERROR.SERVER.INTERNAL_SERVER_ERROR.code);
            return res.status(HttpStatus.SUCCESSFUL.OK.code).json(result.rows)
        } catch (e) {
            return res.sendStatus(HttpStatus.ERROR.SERVER.INTERNAL_SERVER_ERROR.code);
        }
    }

    async getGroups(req: Request<any, any, any>, res: Response<any>, next: NextFunction){
        try{
            const {userId, playlistId} = req.params;
            const {filter} = req.query;
            const result = await dbCtrl.pool.query(PlaylistSql.getGroups(userId, playlistId, {filter }));
            if(!result) return res.sendStatus(HttpStatus.ERROR.SERVER.INTERNAL_SERVER_ERROR.code);
            return res.status(HttpStatus.SUCCESSFUL.OK.code).json(result.rows)
        } catch (e) {
            return res.sendStatus(HttpStatus.ERROR.SERVER.INTERNAL_SERVER_ERROR.code);
        }
    }


    //
    // async delete(req: Request<any, any, any>, res: Response<any>, next: NextFunction): Promise<any> {
    //     const {channelId, userId} = req.params;
    //     if(!channelId || !userId) return;
    //
    //     try{
    //         await dbCtrl.pool.query(PlaylistSql.delete(channelId, userId));
    //         return res.sendStatus(HttpStatus.SUCCESSFUL.CREATED.code);
    //     } catch (e) {
    //         return res.sendStatus(HttpStatus.ERROR.SERVER.INTERNAL_SERVER_ERROR.code);
    //     }
    // }
    //
    async insert(req: Request<any, any, any>, res: Response<any>, next: NextFunction): Promise<any> {
        const {playlist} = req.body;
        try{
            await dbCtrl.pool.query(PlaylistSql.insert(playlist));
            return res.sendStatus(HttpStatus.SUCCESSFUL.CREATED.code);
        } catch (e) {
            return res.sendStatus(HttpStatus.ERROR.SERVER.INTERNAL_SERVER_ERROR.code);
        }
    }
}

export default new Playlist();

