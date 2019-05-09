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
        this.hls.attachMedia(video)
        this.hls.on(Hls.Events.MANIFEST_PARSED,async function() {
            await video.play();
        });
    }
}();