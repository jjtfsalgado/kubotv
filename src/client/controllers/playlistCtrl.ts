import HttpController from "./http";

export interface IPlaylist {
    description: string
    user_account_id: string;
    id: string;
}

export interface IGroupPlaylist {
    group_title: string | "All"
}

export const playlistCtrl = new class{
    public async getUserPlaylists(userId: string, filter?: string): Promise<Array<IPlaylist>>{
        const res = await HttpController.get<Array<IPlaylist>>(`/playlist/${userId}/${filter ? `?filter=${filter}` : ""}`, {promptError: true});
        if(!res){
            return
        }
        return res.data;
    }

    public async getPlaylistGroups(userId: string, playlistId: string,  filter?: string): Promise<Array<IGroupPlaylist>>{
        const res = await HttpController.get<Array<IGroupPlaylist>>(`/playlist/groups/${userId}/${playlistId}/${filter ? `?filter=${filter}` : ""}`, {promptError: true});
        if(!res){
            return
        }
        return res.data;
    }
}();
