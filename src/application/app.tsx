import * as React from 'react';
import css from "./app.less";
import {ChannelList} from "./channels/channel_list";
import {VideoContainer} from "./video/container";
import {Ad} from "../components/advertisement/ad";
import ToolBar from "./channels/toolbar";
import {hls} from "../controllers/hls";

export class App extends React.Component<{},{}>{
    async componentWillMount(){
        const urlParams = new URLSearchParams(window.location.search);
        if(!urlParams){return};
        const urlParam = urlParams.get("url");
        if(urlParam){
            const channels = await hls.loadFromUrl(urlParam);
            await hls.updateView(channels, true);
            window.history.replaceState(null, null, window.location.pathname);
        }
    }

    render() {
        return (
            <div className={css.app}>
                <div className={css.ad}>
                    <ToolBar/>
                </div>
                <div className={css.body}>
                    <VideoContainer className={css.video}/>
                    <ChannelList className={css.channels}/>
                </div>
                <div className={css.footer}>
                    <Ad client={"ca-pub-9406837176504492"}
                        slot={"5196477120"}
                        style={{display:"inline-block",width:"970px",height:"90px"}}/>
                </div>
            </div>
        )
    }
}





