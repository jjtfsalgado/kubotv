import {db} from "../../db";
import pgFormat from "pg-format";

const ChannelSql = {
    get: (id: string, opts: {limit, offset, filter, isFavourite, isRecent}) => ({
        text: `select * from db.getUserChannels($1, $2, $3, $4, $5, $6)`,
        values: [id, opts.limit, opts.offset, opts.filter, opts.isFavourite, opts.isRecent]
    }),
    getTotal: (id: string, opts: {filter, isFavourite, isRecent}) => ({
        text: `select db.getUserChannelsTotal($1, $2, $3, $4) as count`,
        values: [id, opts.filter, opts.isFavourite, opts.isRecent]
    }),
    insert: <T>(values) => db.insert<T>("db.user_channel", values),
    updateFavourites: <T>(values) =>  {
        const setValues: Array<Array<any>> = values.map(i => Object.values(i));
        return pgFormat(`UPDATE %s AS y set is_favourite = x.is_favourite::boolean FROM (VALUES %2$L) as x(id, is_favourite) where x.id = y.id::text`, 'db.user_channel', setValues)
    }
};

export default ChannelSql;

