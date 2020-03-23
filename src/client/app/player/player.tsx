import {VideoContainer} from "./video/container";
import {ChannelList} from "./channels/channel_list";
import * as React from "react";
import {useEffect} from "react";
import {ToolBar} from "../../ui/toolbar/toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/core/SvgIcon/SvgIcon";
import {Button} from "@material-ui/core";
import axios from "axios";
import {useHistory} from "react-router-dom"

import * as H from "history";
import localStorageCtrl from "../../controllers/localhost";
import {hls, IChannel} from "../../controllers/hls";
import {showLoadPlaylistDialog} from "./channels/load_playlist.dialog";
import {showSelectPlaylistDialog} from "./channels/select_channels.dialog";

import css from "./player.less";
import {Search} from "../../ui/search/search";

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
        const res = await showLoadPlaylistDialog();

        if(!res) return;

        const selected = await showSelectPlaylistDialog({data: res});
        if(!selected) return;

        const p: Array<IChannel> = selected.map(i => ({...i, user_account_id: localStorageCtrl.userIdGet, channel_name: i.description}));
        axios.post("/channel", {channels: p})
    }

    const onSearch = (value: string) => {
        hls.search(value);
    };

    return (
        <div className={css.player}>
            <div className={css.sidePanel}>
                <ToolBar>
                    <IconButton onClick={() => onToggleMenu()}
                                aria-label="Open drawer">
                        <MenuIcon/>
                    </IconButton>
                    <Button onClick={() => onLogout(history)}>Logout</Button>
                </ToolBar>
                <ChannelList className={css.channels}/>
            </div>
            <div className={css.body}>
                <Search placeholder={"Search"}
                        className={css.search}
                        onChange={onSearch}/>
                <VideoContainer className={css.video}/>
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
