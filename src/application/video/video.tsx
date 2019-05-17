import * as React from "react";

import css from "./video.less";
import {cls} from "../../utils/function";
import {hls} from "../../controllers/hls";

interface IVideoProps{
    showControls?: boolean;
    className?: string;
}

export class Video extends React.Component<IVideoProps,{}>{
    render() {
        const {showControls, className} = this.props;
        return <video id="video"
                      className={cls(css.video, className)}
                      controls={showControls}/>
    }

    componentDidMount(): void {
        var video = document.getElementById('video') as HTMLVideoElement;
        if(hls.isSupported()) {
            hls.loadChannel('http://173.236.10.10:1935/dgrau/dgrau/live.m3u8', 'video');

        }
        // hls.js is not supported on platforms that do not have Media Source Extensions (MSE) enabled.
        // When the browser has built-in HLS support (check using `canPlayType`), we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video element throught the `src` property.
        // This is using the built-in support of the plain video element, without using hls.js.
        // Note: it would be more normal to wait on the 'canplay' event below however on Safari (where you are most likely to find built-in HLS support) the video.src URL must be on the user-driven
        // white-list before a 'canplay' event will be emitted; the last video event that can be reliably listened-for when the URL is not on the white-list is 'loadedmetadata'.
        // else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        //     video.src = 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8';
        //     video.addEventListener('loadedmetadata',async function() {
        //         await video.play();
        //     });
        // }
    }
}