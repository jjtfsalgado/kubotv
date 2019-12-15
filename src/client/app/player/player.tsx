import {VideoContainer} from "./video/container";
import {ChannelList} from "./channels/channel_list";
import * as React from "react";
import {useEffect} from "react";
import css from "./player.less";
import {ToolBar} from "../../ui/toolbar/toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/core/SvgIcon/SvgIcon";
import Toolbar from "@material-ui/core/Toolbar";

export function Player(){
    useEffect(() => {
        // const urlParams = new URLSearchParams(window.location.search);
        // if(!urlParams){return};
        // const urlParam = urlParams.get("url");
        // if(urlParam){
        //     const channels = await hls.loadFromUrl(urlParam);
        //     await hls.updateView(channels, true);
        //     window.history.replaceState(null, null, window.location.pathname);
        // }
    }, []);

    function onToggleMenu(){

    }

    return (
        <div className={css.player}>
            <ToolBar>
                <IconButton color="inherit"
                            onClick={onToggleMenu}
                            aria-label="Open drawer">
                    <MenuIcon/>
                </IconButton>
            </ToolBar>
            <div className={css.body}>
                <VideoContainer className={css.video}/>
                <ChannelList className={css.channels}/>
            </div>
        </div>
    )
}