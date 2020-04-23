import {db} from "../../db";

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
    update: <T>(values) => db.update<T>("db.user_channel", values)
};

export default ChannelSql;

