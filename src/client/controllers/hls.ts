import * as Hls from "hls.js";
import {Config} from "hls.js";
import axios from "axios";
import {m3uToJson} from "../../utils/m3u_json_parser";
import {readFile, sortByMany} from "../../utils/function";
import {eventDispatcher, EVENTS} from "./pub_sub";

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

let base;


class pLoader extends Hls.DefaultConfig.loader {
    constructor(config) {
        super(config);
        var load = this.load.bind(this);
        this.load = function(context, config, callbacks) {
            if(context.type == 'manifest') {
                var onSuccess = callbacks.onSuccess;
                callbacks.onSuccess = function(response, stats, context) {
                    response.data = response.data;
                    onSuccess(response,stats,context);
                }
            }
            load(context,config,callbacks);
        };
    }
}


const config: Partial<Config & {baseUrl: string}> = {
    // autoStartLoad: false
    // debug: true,
    // pLoader: function (config) {
    //     let loader = new Hls.DefaultConfig.loader(config);
    //
    //     this.abort = () => loader.abort();
    //     this.destroy = () => loader.destroy();
    //     this.load = (context, config, callbacks) => {
    //         let {type, url} = context;
    //
    //
    //
    //         // context.url = `/proxy/${encodeURIComponent(url)}`;
    //         //
    //         // console.log(context)
    //         //
    //         // if (type === 'manifest') {
    //         //     console.log(`Manifest ${context.url} will be loaded.`);
    //         // }
    //
    //         // callbacks.onSuccess = (response, stats, context, xhr) => {
    //         //     console.log(response.responseURL)
    //         // };
    //
    //
    //         loader.load(context, config, callbacks);
    //     };
    // } as any,
    // fLoader: function (config) {
    //     let loader = new Hls.DefaultConfig.loader(config);
    //
    //     this.abort = () => loader.abort();
    //     this.destroy = () => loader.destroy();
    //     this.load = (context, config, callbacks) => {
    //         let {type, url} = context;
    //
    //         // context.url = `/proxy/${encodeURIComponent(url)}`;
    //         // console.log("fragment loader -> ", context);
    //         //
    //         // if (type === 'manifest') {
    //         //     console.log(`Manifest ${context.url} will be loaded.`);
    //         // }
    //
    //
    //         loader.load(context, config, callbacks);
    //     };
    // } as any,

    // xhrSetup: function(xhr, url) {
    //
    //     xhr.open("GET", `/proxy/${encodeURIComponent(url)}`, true);
    // }
    // pLoader
};


export const hls = new class{
    private key = "js_playlist";

    base: string;

    constructor() {
        this.hls = new Hls(config)
    }

    private hls: Hls;

    public isSupported(){


        return Hls.isSupported()
    }

    public async loadChannel (channel: IChannel){
        console.log("#### loading channel");

        eventDispatcher.publish(EVENTS.CHANNEL_UPDATE, channel);
        // const url = channel.url;
        // const video = document.getElementById("video") as HTMLVideoElement;
        //
        // if(this.isSupported()){
        //
        //     // this.hls.loadSource(`/proxy/${url}`);
        //
        //     // this.hls.detachMedia();
        //
        //     // this.hls.detachMedia();
        //     // this.hls.stopLoad();
        //
        //     this.hls.attachMedia(video);
        //
        //     const prom = new Promise((res, rej) => {
        //         this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        //             this.hls.loadSource(`${url}`);
        //
        //             // this.hls.startLoad();
        //             this.hls.on(Hls.Events.MANIFEST_PARSED,async () => {
        //                 await video.play();
        //                 res();
        //             });
        //         });
        //     });
        //
        //     await prom;
        //
        //     this.hls.on(Hls.Events.ERROR, async (event: any, data) => {
        //         const errorType = data.type;
        //         const errorDetails = data.details;
        //         const errorFatal = data.fatal;
        //         console.error(url, data);
        //
        //         if(errorFatal){
        //             switch(errorType) {
        //                 case Hls.ErrorTypes.NETWORK_ERROR:
        //                     // try to recover network error
        //                     // console.warn("fatal network error encountered, try to recover");
        //
        //                     // data.response.code === 403 || data.response.code === 404 ||
        //                     if(Hls.ErrorDetails.MANIFEST_LOAD_ERROR === errorDetails){
        //                         this.hls.detachMedia();
        //                         this.hls.stopLoad();
        //                     }else{
        //                         this.hls.startLoad();
        //                     }
        //                     break;
        //                 case Hls.ErrorTypes.MEDIA_ERROR:
        //                     // console.warn("fatal media error encountered, try to recover");
        //                     this.hls.recoverMediaError();
        //                     break;
        //                 default:
        //                     // console.error("couldnt load the selected channel");
        //                     // cannot recover
        //                     this.hls.destroy();
        //                     break;
        //             }
        //         }
        //     });
        // }else if(video.canPlayType('app/vnd.apple.mpegurl')){
        //     video.src = url;
        //     video.addEventListener('loadedmetadata',async () => {
        //         await video.play();
        //     });
        // }
    }

    public deleteChannel(item:IChannel){
        if(!item){return}
        const channels = this.getData;
        if(!channels){return};
        const filtered = channels.filter((i: IChannel) => i.url !== item.url);
        this.updateView(filtered, true)
    }

    public toggleFavorite(item:IChannel){
        if(!item){return}
        const channels = this.getData;
        if(!channels){return};
        const channelIndex = channels.findIndex((i: IChannel) => i.id === item.id);
        const channel = channels[channelIndex];
        channel.favorite = !channel.favorite;
        channels[channelIndex] = channel;

        this.updateView(channels, true)
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
        const response = await axios.get(`/proxy/${url}`);
        return m3uToJson(response.data)
    }

    public async loadFromFile(file: any){
        const response = await readFile(file);
        return m3uToJson(response)
    }

    // public async init(){
    //
    //     debugger
    //     const playlist = this.getData;
    //     await this.loadChannel(playlist[0]);
    //     return playlist;
    // }

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