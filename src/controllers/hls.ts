import * as Hls from "hls.js";

export const hls = new class{
    constructor() {
        this.hls = new Hls()
    }

    private hls: Hls;

    public isSupported(){
        return Hls.isSupported()
    }

    public loadSource(url: string, targetMediaId: string){
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
}();