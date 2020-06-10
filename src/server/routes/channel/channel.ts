import {dbCtrl} from "../../db";
import ChannelSql from "./channel.sql";
import {NextFunction, Request, Response} from "express-serve-static-core";
import {HttpStatus} from "../../../utils/http_status";
import {IChannelView} from "../../../client/reducers/channel";
import PlaylistSql from "../playlist/playlist.sql";
import {newGuid} from "../../../utils/function";
import {IPlaylist} from "../../../client/controllers/playlistCtrl";
import {m3uToJson} from "../../../utils/m3u_parser";
import * as request from "request";

interface IChannel {
    get(req: Request<any, any, any>, res: Response<any>, next: NextFunction) : Promise<any>
    insert(req: Request<any, any, any>, res: Response<any>, next: NextFunction) : Promise<any>
    getTotal(req: Request<any, any, any>, res: Response<any>, next: NextFunction) : Promise<any>
    updateFavourites(req: Request<any, any, any>, res: Response<any>, next: NextFunction) : Promise<any>
}

interface IChannelPlaylist {
    description: string;
    url: string;
    is_favourite?: boolean;
    logo_url?: string
    language?: string;
    channel_name?: string;
    group_title?: string;
    user_playlist_id?: string
    user_account_id?: string;
    id?: string;
}

class Channel implements IChannel{
    async get(req: Request<any, any, any>, res: Response<any>, next: NextFunction){
        try{
            const {userId, playlistId} = req.params;
            const {limit, offset, filter, group} = req.query;
            const result = await dbCtrl.pool.query(ChannelSql.get(userId, playlistId, {offset: parseInt(offset), limit: parseInt(limit), filter, group}));
            if(!result) return res.sendStatus(HttpStatus.ERROR.SERVER.INTERNAL_SERVER_ERROR.code);
            return res.status(HttpStatus.SUCCESSFUL.OK.code).json(result.rows)
        } catch (e) {
            return res.sendStatus(HttpStatus.ERROR.SERVER.INTERNAL_SERVER_ERROR.code);
        }
    }

    async getTotal(req: Request<any, any, any>, res: Response<any>, next: NextFunction){
        try{
            const {userId, playlistId} = req.params;
            const {filter, group} = req.query;
            const result = await dbCtrl.pool.query(ChannelSql.getTotal(userId, playlistId, {filter, group}));
            if(!result) return res.sendStatus(HttpStatus.ERROR.SERVER.INTERNAL_SERVER_ERROR.code);
            return res.status(HttpStatus.SUCCESSFUL.OK.code).json(result?.rows[0]?.count)
        } catch (e) {
            return res.sendStatus(HttpStatus.ERROR.SERVER.INTERNAL_SERVER_ERROR.code);
        }
    }

    async getFavourites(req: Request<any, any, any>, res: Response<any>, next: NextFunction){
        try{
            const {userId, playlistId} = req.params;
            const {limit, offset, filter} = req.query;
            const result = await dbCtrl.pool.query(ChannelSql.get(userId, playlistId, {offset: parseInt(offset), limit: parseInt(limit), filter, isFavourite: true}));
            if(!result) return res.sendStatus(HttpStatus.ERROR.SERVER.INTERNAL_SERVER_ERROR.code);
            return res.status(HttpStatus.SUCCESSFUL.OK.code).json(result.rows)
        } catch (e) {
            return res.sendStatus(HttpStatus.ERROR.SERVER.INTERNAL_SERVER_ERROR.code);
        }
    }

    async getFavouritesTotal(req: Request<any, any, any>, res: Response<any>, next: NextFunction){
        try{
            const {userId, playlistId} = req.params;
            const {filter} = req.query;
            const result = await dbCtrl.pool.query(ChannelSql.getTotal(userId, playlistId, {filter, isFavourite: true}));
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
        const {userId} = req.params;
        const {file} = req.body;

        try{
            const playlistId = newGuid();
            const playlist: Array<IPlaylist> = [{id: playlistId, user_account_id: userId, description: file.description}]

            let data;

            if(file.type === "file"){
                data = await m3uToJson(file.data);
            } else{
                const url = `${req.protocol}://${req.get('host')}/proxy/${file.data}`
                data = await loadFromUrl(url)
            }
            const channels: Array<IChannelPlaylist> = data.map(i => ({...i, user_account_id: userId, channel_name: i.description, user_playlist_id: playlistId}));

            await dbCtrl.pool.query(PlaylistSql.insert(playlist))
            await dbCtrl.pool.query(ChannelSql.insert(channels));

            return res.sendStatus(HttpStatus.SUCCESSFUL.CREATED.code);
        } catch (e) {
            console.log(e)
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

const loadFromUrl = async (url: string) => {
    return new Promise((res, rej) => {
        request.get(url, (error, response, body) => {
            if(error){
                return rej(error)
            }
            return res(m3uToJson(body))
        });
    })
}

export default new Channel();

