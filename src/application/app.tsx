import * as React from 'react';
import css from "./app.less";
import {Video} from "./video/video";
import {ChannelList} from "./channels/channel_list";
import {VideoContainer} from "./video/container";
import {Ad} from "../components/advertisement/ad";

export class App extends React.Component<{},{}>{
    render() {
        return (
            <div className={css.app}>
                <VideoContainer className={css.video}/>
                <ChannelList className={css.channels}/>
            </div>
        )
    }
}





