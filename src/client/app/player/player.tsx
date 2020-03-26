import {VideoContainer} from "./video/container";
import {ChannelList} from "./channels/channel_list";
import * as React from "react";
import {useEffect, useState} from "react";
import axios from "axios";
import {useHistory} from "react-router-dom"

import * as H from "history";
import localStorageCtrl from "../../controllers/localhost";
import {hls, IChannel} from "../../controllers/hls";
import {showLoadPlaylistDialog} from "./channels/load_playlist.dialog";
import {showSelectPlaylistDialog} from "./channels/select_channels.dialog";

import css from "./player.less";
import {Search} from "../../ui/search/search";


interface IPlayerState {
    showSidepanel: boolean;
}

export function Player(){
    const history = useHistory();
    const [state, setState] = useState<IPlayerState>({showSidepanel: true});
    const {showSidepanel} = state;

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

    const onToggleSidePanel = () => setState({showSidepanel: !showSidepanel});

    return (
        <div className={css.player}>
            <div className={css.header}>
                <div className={css.logo}>
                    <button onClick={() => onToggleSidePanel()}>
                        Toggle
                    </button>
                </div>
                <div className={css.search}>
                    <Search placeholder={"Search"}
                            onChange={onSearch}/>
                </div>
                <div className={css.user}>
                    <button onClick={() => onLogout(history)}>Logout</button>
                </div>
            </div>
            <div className={css.body}>
                <div className={css.side} style={{display: showSidepanel ? "flex" : "none"}}>
                    <ChannelList className={css.channels}/>
                </div>
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
