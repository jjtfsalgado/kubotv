import HttpController from "./http";
import localStorageCtrl from "./localhost";

export interface IChannel {
    description: string;
    url: string;
    is_favourite?: boolean;
    logo_url?: string
    language?: string;
    channel_name?: string;
    group_title?: string;
    user_playlist_id?: string
    user_account_id?: string;
    id?: string;
}

export const playerCtrl = new class{


    public async getUserChannels(userId: string, playlistId: string, limit: number, offset: number, filter?: string, group?: string): Promise<Array<IChannel>>{
        const res = await HttpController.get<Array<IChannel>>(`/channel/${userId}/${playlistId}/?offset=${offset}&limit=${limit}${filter ? `&filter=${filter}` : ""}${group ? `&group=${group}` : ""}`, {promptError: true});
        if(!res){
            return
        }
        return res.data;
    }

    public async getUserChannelsTotal(userId: string, playlistId: string, filter?: string, group?: string): Promise<number>{
        const res = await HttpController.get<number>(`/channel/total/${userId}/${playlistId}/?${filter ? `&filter=${filter}` : ""}${group ? `&group=${group}` : ""}`, {promptError: true});
        if(!res){
            return
        }
        return res.data;
    }

    public async getUserFavourites(userId: string, limit: number, offset: number, filter?: string): Promise<Array<IChannel>>{
        const res = await HttpController.get<Array<IChannel>>(`/favourite/${userId}/?offset=${offset}&limit=${limit}${filter ? `&filter=${filter}` : ""}`, {promptError: true});
        if(!res){
            return
        }
        return res.data;
    }

    public async getUserFavouritesTotal(userId: string, filter?: string): Promise<number>{
        const res = await HttpController.get<number>(`/favourite/total/${userId}/?${filter ? `&filter=${filter}` : ""}`, {promptError: true});
        if(!res){
            return
        }
        return res.data;
    };

    public async updateFavourite(channel: Partial<IChannel>){
        const res = await HttpController.patch("/favourite", {channels: [channel]});

        if(!res){
            return
        }

        return res.data;
    }

    public async deleteChannel(channel: IChannel){
        const res = await HttpController.delete(`/channel/${channel.id}&${localStorageCtrl.userIdGet}`);

        if(!res){
            return
        }

        return res.data;
    }
}();
