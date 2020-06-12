import * as React from "react";
// import Clappr from "clappr";
import {cls} from "../../../../utils/function";
import * as mime from "mime-types";
import shaka from "shaka-player";
import {log} from "util";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;


interface IVideoProps{
    showControls?: boolean;
    className?: string;
    url?: string;
}

var manifestUri =
    'https://playertest.longtailvideo.com/adaptive/oceans_aes/oceans_aes.m3u8';

// Log.setLevel(0);

export class Video extends React.Component<IVideoProps,{}>{
    private _player: any;

    constructor(props) {
        super(props);

        // this._player = new Player({
        //     playbackNotSupportedMessage: "Oops, please select a valid channel"
        // });
        // shaka.polyfill.installAll();
    }

    getDomElement = () => document.getElementById("player");

    componentDidMount(): void {
        // this._player.attachTo(this.getDomElement());

        // // Check to see if the browser supports the basic APIs Shaka needs.
        // if (shaka.Player.isBrowserSupported()) {
        //     // Everything looks good!
        //     // Create a Player instance.
        //     var video = document.getElementById('video');
        //     this._player = new shaka.Player(video);
        //     shaka.media.ManifestParser.registerParserByExtension("m3u8", shaka.hls.HlsParser);
        //     shaka.media.ManifestParser.registerParserByMime("Application/vnd.apple.mpegurl", shaka.hls.HlsParser);
        //     shaka.media.ManifestParser.registerParserByMime("application/x-mpegURL", shaka.hls.HlsParser);
        //
        //     // Listen for error events.
        //     this._player.addEventListener('error', (error) => console.log(error));
        //
        //     // Try to load a manifest.
        //     // This is an asynchronous process.
        //     this._player.load(manifestUri).then(function() {
        //         // This runs if the asynchronous load is successful.
        //         console.log('The video has now been loaded!');
        //     });  // onError is executed if the asynchronous load fails.
        // } else {
        //     // This browser does not have the minimum set of APIs we need.
        //     console.error('Browser not supported!');
        // }
        this._player = (window as any).videojs('my-video');

    }

    componentDidUpdate(prevProps: Readonly<IVideoProps>, prevState: Readonly<{}>, snapshot?: any): void {
        const {url} = this.props;

        if(url && prevProps.url !== url){
            if(url.includes("youtube")){
                window.open(url);
            }
        }

        this._player.src(url);
        this._player.play();
        //
        // this._player.load(`${url}`).catch((error) => console.log(error))
    }

    render() {
        const {className, url} = this.props;
        return (
            <video
                id="my-video"
                className="video-js"
                controls
                preload="auto"
                width="640"
                height="264"
                poster="MY_VIDEO_POSTER.jpg"
                data-setup="{}"
            >
                <source src="//vjs.zencdn.net/v/oceans.mp4" type="video/mp4"></source>
                <source src="//vjs.zencdn.net/v/oceans.webm" type="video/webm"></source>
                <source src="//vjs.zencdn.net/v/oceans.ogv" type="video/ogg"></source>
                <p className="vjs-no-js">
                    To view this video please enable JavaScript, and consider upgrading to a
                    web browser that
                    <a href="https://videojs.com/html5-video-support/" target="_blank"
                    >supports HTML5 video</a
                    >
                </p>
            </video>
        )
    }
}
