import {VideoContainer} from "./video/container";
import {ChannelList} from "./channels/channel_list";
import * as React from "react";
import {useEffect} from "react";
import css from "./player.less";
import {ToolBar} from "../../ui/toolbar/toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/core/SvgIcon/SvgIcon";
import {Button} from "@material-ui/core";
import axios from "axios";

import {useHistory} from "react-router-dom"
import * as H from "history";

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

    const history = useHistory();

    return (
        <div className={css.player}>
            <ToolBar>
                <IconButton onClick={onToggleMenu}
                            aria-label="Open drawer">
                    <MenuIcon/>
                </IconButton>
                <Button onClick={() => onLogout(history)}>Logout</Button>
            </ToolBar>
            <div className={css.body}>
                <VideoContainer className={css.video}/>
                <ChannelList className={css.channels}/>
            </div>
        </div>
    )
}

async function onLogout(history: H.History<any>){
    const res = await axios.delete("/login");
    if(!res) return;

    history.push("/")
}
