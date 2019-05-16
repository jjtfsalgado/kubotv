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

    constructor() {
        this.hls = new Hls()
    }

    private hls: Hls;

    public isSupported(){
        return Hls.isSupported()
    }

    public loadChannel(url: string, targetMediaId: string){
        const video = document.getElementById(targetMediaId) as HTMLVideoElement;
        this.hls.loadSource(url);
        this.hls.config.xhrSetup = (xhr, url) => {
            // xhr.setRequestHeader("Access-Control-Allow-Headers", "X-Custom-Header");
            // xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

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

    public updateView(playlist:Array<IChannel>){
        this.dispatcher(playlist)
    }
}();