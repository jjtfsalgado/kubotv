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
import localStorageCtrl from "../../controllers/localhost";
import {hls} from "../../controllers/hls";
import {LoadPlaylistDialog} from "./channels/load_playlist_dialog";
import {ListDialog} from "./channels/list_dialog";

export function Player(){
    useEffect(() => {
        (async () => {
            // const urlParams = new URLSearchParams(window.location.search);
            // if(!urlParams) return;

            // let urlParam = "https://raw.githubusercontent.com/freearhey/iptv/master/channels/pt.m3u";

            const {data} = await axios.get(`/channel/${localStorageCtrl.userIdGet}`);
            console.log(data)
            await hls.updateView(data.channels, true);
            window.history.replaceState(null, null, window.location.pathname);
        })();
    }, []);

    async function onToggleMenu(){
        const result = await LoadPlaylistDialog.show();


        const playlist = await ListDialog.show({data: result});

        //todo store the result on the database

        debugger

    }

    const history = useHistory();

    return (
        <div className={css.player}>
            <ToolBar>
                <IconButton onClick={() => onToggleMenu()}
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

    localStorageCtrl.tokenDelete();
    history.push("/")
}
