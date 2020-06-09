import {db} from "../../db";
import pgFormat from "pg-format";

const ChannelSql = {
    get: (id: string, playlistId: string, opts: {limit, offset, filter, isFavourite?, group?}) => ({
        text: `select * from db.getUserChannels($1, $2, $3, $4, $5, $6, $7)`,
        values: [id, playlistId, opts.limit, opts.offset, opts.filter, opts.group, opts.isFavourite]
    }),
    getTotal: (id: string, playlistId: string, opts: {filter, isFavourite?, group?}) => ({
        text: `select db.getUserChannelsTotal($1, $2, $3, $4, $5) as count`,
        values: [id, playlistId, opts.filter, opts.group, opts.isFavourite]
    }),
    delete: (channelId: string, userId: string) => ({
        text: `delete from db.user_channel uc where uc.id = $1 and uc.user_account_id = $2`,
        values: [channelId, userId]
    }),
    deleteFavourites: (userId: string) => ({
        text: `delete from db.user_channel uc where uc.is_favourite = true and uc.user_account_id = $1`,
        values: [userId]
    }),
    deleteRecent: (userId: string) => ({
        text: `delete from db.user_channel uc where uc.created_date >= NOW() - INTERVAL '1 DAY' and uc.user_account_id = $1`,
        values: [userId]
    }),
    deleteAll: (userId: string) => ({
        text: `delete from db.user_channel uc where uc.user_account_id = $1`,
        values: [userId]
    }),
    insert: <T>(values) => db.insert<T>("db.user_channel", values),
    updateFavourites: (values) =>  {
        const setValues: Array<Array<any>> = values.map(i => Object.values(i));
        return pgFormat(`UPDATE %s AS y set is_favourite = x.is_favourite::boolean FROM (VALUES %2$L) as x(id, is_favourite) where x.id = y.id::text`, 'db.user_channel', setValues)
    }
};

export default ChannelSql;

