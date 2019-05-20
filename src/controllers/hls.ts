import * as Hls from "hls.js";
import axios from "axios";
import {m3uToJson} from "../utils/m3u_json_parser";

export interface IChannel {
    'group-title': string;
    title: string;
    'tvg-id': string
    'tvg-logo': string
    'tvg-name': string;
    url: string;
}

export const hls = new class{
    private dispatcher: (playlist: Array<IChannel>) => void;
    private key = "js_playlist";

    constructor() {
        this.hls = new Hls()
    }

    private hls: Hls;

    public isSupported(){
        return Hls.isSupported()
    }

    public async loadChannel (url: string){
        const video = document.getElementById("video") as HTMLVideoElement;
        this.hls.loadSource(url);
        this.hls.config.xhrSetup = (xhr, url) => {
            return xhr;
        };
        this.hls.attachMedia(video);
        this.hls.on(Hls.Events.MANIFEST_PARSED,async function() {
            await video.play();
        });
    }

    public set register(callback: (playlist:Array<IChannel>) => void){
        this.dispatcher = callback;
    }

    public async loadPlaylist(url: string){
        const response = await axios.get(url);
        return m3uToJson(response.data)
    }

    public async init(){
        const playlist = JSON.parse(localStorage.getItem(this.key));
        await this.loadChannel(playlist[0].url);
        return playlist;
    }

    public updateView(playlist:Array<IChannel>){
        if(!playlist){return}

        localStorage.setItem(this.key, JSON.stringify(playlist));
        this.dispatcher(playlist)
    }
}();