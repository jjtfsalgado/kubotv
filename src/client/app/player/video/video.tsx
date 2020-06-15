import * as React from "react";
import Clappr from "clappr";
import {cls} from "../../../../utils/function";
import * as mime from "mime-types";
const {Player} = Clappr

interface IVideoProps{
    showControls?: boolean;
    className?: string;
    url?: string;
}

// Log.setLevel(0);

export class Video extends React.Component<IVideoProps,{}>{
    private _player: any;

    constructor(props) {
        super(props);

        this._player = new Player({
            playbackNotSupportedMessage: "Oops, please select a valid channel"
        });
    }

    getDomElement = () => document.getElementById("player");

    componentDidMount(): void {
        this._player.attachTo(this.getDomElement());
    }

    componentDidUpdate(prevProps: Readonly<IVideoProps>, prevState: Readonly<{}>, snapshot?: any): void {
        const {url} = this.props;

        if(url && prevProps.url !== url){
            if(url.includes("youtube")){
                window.open(url);
            }

            const mimeType = mime.lookup(url);
            this._player.load(`/proxy/${url}`, mimeType || undefined);
            this._player.play();
        }
    }

    render() {
        const {className} = this.props;
        return (
            <div className={cls(className)} id={"player"}/>
        )
    }
}
