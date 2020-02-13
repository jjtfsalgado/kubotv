const ChannelSql = {
    getAll: (id: string) => ({
        text: "select * from db.user_channel uc where uc.user_account_id = $1",
        values: [id]
    })
};

export default ChannelSql;