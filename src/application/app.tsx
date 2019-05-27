import * as React from 'react';
import css from "./app.less";
import {ChannelList} from "./channels/channel_list";
import {VideoContainer} from "./video/container";
import {Ad} from "../components/advertisement/ad";
import ToolBar from "./channels/toolbar";

export class App extends React.Component<{},{}>{
    render() {
        return (
            <div className={css.app}>
                <div className={css.ad}>
                    <ToolBar/>
                </div>
                <VideoContainer className={css.video}/>
                <ChannelList className={css.channels}/>
                <div className={css.footer}>
                    <Ad client={"ca-pub-9406837176504492"}
                        slot={"5196477120"}
                        style={{display:"inline-block",width:"970px",height:"90px"}}/>
                </div>
            </div>
        )
    }
}





