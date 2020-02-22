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
import {hls, IChannel} from "../../controllers/hls";
import {LoadPlaylistDialog} from "./channels/load_playlist_dialog";
import {ListDialog} from "./channels/list_dialog";

export function Player(){
    const history = useHistory();

    useEffect(() => {
        (async () => {

            let data;
            try {
                const res = await axios.get(`/channel/${localStorageCtrl.userIdGet}`);
                data = res.data;
            }catch (e) {
                //fixme add a better error handling for unauthorised requests. create an http abstraction that captures this errors and handles them
                return history.push("/")
            }


            await hls.updateView(data.channels, true);
        })();
    }, []);
    async function onToggleMenu(){
        const result = await LoadPlaylistDialog.show();

        const playlist: Array<any> = await ListDialog.show({data: result});
        const p: Array<IChannel> = playlist.map(i => ({...i, user_account_id: localStorageCtrl.userIdGet, channel_name: i.description}));
        axios.post("/channel", {channels: p})

    }

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
