import {db} from "../../db";

const ChannelSql = {
    getAll: (id: string) => ({
        text: "select * from db.user_channel uc where uc.user_account_id = $1",
        values: [id]
    }),
    insertAll: <T>(values) => db.insert<T>("db.user_channel", values)
};

export default ChannelSql;

