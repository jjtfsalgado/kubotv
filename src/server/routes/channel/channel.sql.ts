import {db} from "../../db";

const ChannelSql = {
    get: (id: string, opts: {limit, offset, filter, isFavourite, isRecent}) => {
        return ({
        text: `select count(*) over(), * from db.getuserchannels($1, $2, $3, $4, $5, $6)`,
        values: [id, opts.limit, opts.offset, opts.filter, opts.isFavourite, opts.isRecent]
    })},
    getTotal: (id: string, opts: {filter, isFavourite, isRecent}) => {
        return ({
        text: `select db.getuserchannelstotal($1, $2, $3, $4) as count`,
        values: [id, opts.filter, opts.isFavourite, opts.isRecent]
    })},
    insert: <T>(values) => db.insert<T>("db.user_channel", values)
};

export default ChannelSql;

