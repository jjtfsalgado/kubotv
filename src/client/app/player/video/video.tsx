import * as React from "react";
import {Player, Log} from "clappr";
import css from "./video.less";
import {cls} from "../../../../utils/function";

interface IVideoProps{
    showControls?: boolean;
    className?: string;
    url?: string;
}

// Log.setLevel(0);

export class Video extends React.Component<IVideoProps,{}>{
    private _player: Player;

    constructor(props) {
        super(props);

        this._player = new Player({
            // source: url,
            // poster: 'http://clappr.io/poster.png',
        });
    }


    componentDidMount(): void {
        const {url} = this.props;

        const dom = document.getElementById("player");

        const size = dom.parentElement.getBoundingClientRect();

        this._player.attachTo(dom);
        this._player.resize({height: size.height, width: size.width});
    }

    componentDidUpdate(prevProps: Readonly<IVideoProps>, prevState: Readonly<{}>, snapshot?: any): void {
        if(prevProps.url !== this.props.url){
            this._player.load(this.props.url, "application/x-mpegURL");
            this._player.play();
        }
    }

    render() {
        const {showControls, className} = this.props;
        return (
            <div className={cls(className, css.container)}>
                <div id={"player"}/>
            </div>
        )
    }
}