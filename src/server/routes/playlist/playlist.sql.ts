import {db} from "../../db";

const PlaylistSql = {
    get: (id: string, opts: {filter}) => ({
        text: `select * from db.getUserPlaylists($1, $2)`,
        values: [id, opts.filter]
    }),
    getGroups: (id: string, playlistId: string, opts: {filter}) => ({
        text: `select * from db.getPlaylistGroups($1, $2, $3)`,
        values: [id, playlistId, opts.filter]
    }),

    // delete: (channelId: string, userId: string) => ({
    //     text: `delete from db.user_channel uc where uc.id = $1 and uc.user_account_id = $2`,
    //     values: [channelId, userId]
    // }),
    insert: <T>(values) => db.insert<T>("db.user_playlist", values),
};

export default PlaylistSql;

