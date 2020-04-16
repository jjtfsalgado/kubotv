import {db} from "../../db";

const ChannelSql = {
    get: (id: string, opts: {limit, offset, filter}) => ({
        text: `select count(*) over(), * from db.user_channel uc where uc.user_account_id = $1 ${opts.filter ? `and LOWER(uc.description) like '%${opts.filter}%'` : ""} order by uc.description limit ${opts.limit} offset ${opts.offset}`,
        values: [id]
    }),
    insert: <T>(values) => db.insert<T>("db.user_channel", values)
};

export default ChannelSql;

