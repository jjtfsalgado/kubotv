import * as React from "react";

import css from "./video.less";
import {cls} from "../../../../utils/function";

interface IVideoProps{
    showControls?: boolean;
    className?: string;
}

export class Video extends React.Component<IVideoProps,{}>{
    render() {
        const {showControls, className} = this.props;
        return <video id="video"
                      className={cls(css.player, className)}
                      controls={showControls}/>
    }
}