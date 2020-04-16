import axios from "axios";
import {m3uToJson} from "../../utils/m3u_json_parser";
import {delay, readFile} from "../../utils/function";
import {store} from "../reducers";
import {channelSlice} from "../reducers/channel";
import localStorageCtrl from "./localhost";
import HttpController from "./http";

export interface IChannel {
    description: string;
    url: string;
    is_favourite?: boolean;
    logo_url?: string
    language?: string;
    channel_name: string;
    parent_id?: string
    user_account_id: string;
    id?: string;
}

export const hls = new class{
    public async loadFromUrl(url: string){
        const response = await axios.get(`/proxy/${url}`);
        return m3uToJson(response.data)
    }

    public async loadFromFile(file: any){
        const response = await readFile(file);
        return m3uToJson(response)
    }

    public async getUserChannels(userId: string, limit?: number, offset?: number, filter?: string): Promise<Array<IChannel>>{
        const res = await HttpController.get<Array<IChannel>>(`/channel/${userId}/?offset=${offset}&limit=${limit}&filter=${filter}`, {promptError: true});
        if(!res){
            return
        }
        return res.data;
    }

    public async getUserChannelsTotal(userId: string): Promise<number>{
        const res = await HttpController.get<number>(`/channel/${userId}/total`, {promptError: true});
        if(!res){
            return
        }
        return res.data;
    }
}();
