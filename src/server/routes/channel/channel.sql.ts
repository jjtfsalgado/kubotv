import {db} from "../../db";

const ChannelSql = {
    get: (id: string, opts: {limit, offset}) => ({
        text: `select * from db.user_channel uc where uc.user_account_id = $1 order by uc.description limit ${opts.limit} offset ${opts.offset}`,
        values: [id]
    }),
    getTotal: (id: string) => ({
        text: `select count(*) from db.user_channel uc where uc.user_account_id = $1`,
        values: [id]
    }),
    insert: <T>(values) => db.insert<T>("db.user_channel", values)
};

export default ChannelSql;

