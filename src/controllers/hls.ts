import * as Hls from "hls.js";
import axios from "axios";
import {m3uToJson} from "../utils/m3u_json_parser";
import {readFile} from "../utils/function";
import {eventDispatcher, EVENTS} from "./pub_sub";

export interface IChannel {
    'group-title': string;
    title: string;
    'tvg-id': string
    'tvg-logo': string
    'tvg-name': string;
    url: string;
    id: string
}

export const hls = new class{
    private key = "js_playlist";

    constructor() {
        this.hls = new Hls()
    }

    private hls: Hls;

    public isSupported(){
        return Hls.isSupported()
    }

    public async loadChannel (channel: IChannel){
        eventDispatcher.publish(EVENTS.CHANNEL_UPDATE, channel);
        const url = channel.url;
        const video = document.getElementById("video") as HTMLVideoElement;

        this.hls.loadSource(url);
        this.hls.attachMedia(video);
        this.hls.on(Hls.Events.MANIFEST_PARSED,async () => {
            await video.play();
        });
        this.hls.on(Hls.Events.ERROR, async (event: any, data) => {
            const errorType = data.type;
            const errorDetails = data.details;
            const errorFatal = data.fatal;
            console.error(url, data);

            if(errorFatal){
                switch(errorType) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        // try to recover network error
                        console.warn("fatal network error encountered, try to recover");
                        this.hls.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        console.warn("fatal media error encountered, try to recover");
                        this.hls.recoverMediaError();
                        break;
                    default:
                        // cannot recover
                        this.hls.destroy();
                        break;
                }
            }
        });
    }

    public deleteChannel(item:IChannel){
        if(!item){return}
        const channels = this.getData;
        if(!channels){return};
        const filtered = channels.filter((i: IChannel) => i.url !== item.url);
        this.updateView(filtered, true)
    }

    private get getData(){
        return JSON.parse(localStorage.getItem(this.key));
    };

    public deleteData(){
        localStorage.removeItem(this.key);
        eventDispatcher.publish(EVENTS.PLAYLIST_UPDATE, this.getData)
    };

    private set setData(playlist: Array<IChannel>){
        localStorage.setItem(this.key, JSON.stringify(playlist));
    };

    public async loadFromUrl(url: string){
        const response = await axios.get(url);
        return m3uToJson(response.data)
    }

    public async loadFromFile(file: any){
        const response = await readFile(file);
        return m3uToJson(response)
    }

    public async init(){
        const playlist = this.getData;
        await this.loadChannel(playlist[0]);
        return playlist;
    }

    public search(value: string){
        let playlist = this.getData;
        if(value){
            playlist = playlist.filter(i => i.title.toLowerCase().includes(value.toLowerCase()));
        }

        eventDispatcher.publish(EVENTS.PLAYLIST_UPDATE, playlist)
    }

    public updateView(playlist:Array<IChannel>, replace?: boolean){
        if(!playlist){return}

        if(!replace && this.getData){
            playlist = playlist.concat(this.getData)
        }

        this.setData = playlist;
        eventDispatcher.publish(EVENTS.PLAYLIST_UPDATE, this.getData)
    }
}();