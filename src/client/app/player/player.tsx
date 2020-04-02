import {VideoContainer} from "./video/container";
import {ChannelList} from "./channels/channel_list";
import * as React from "react";
import {useEffect, useState} from "react";
import axios from "axios";
import {useHistory} from "react-router-dom"
import * as H from "history";
import localStorageCtrl from "../../controllers/localhost";
import {hls, IChannel} from "../../controllers/hls";
import {LoadPlaylist} from "./load_playlist.dialog";
import css from "./player.less";
import {Search} from "../../ui/search/search";
import {showDialog} from "../../ui/dialog/dialog";

interface IPlayerState {
    showSidepanel: boolean;
}

export const Player = () => {
    const history = useHistory();
    const [state, setState] = useState<IPlayerState>({showSidepanel: true});
    const {showSidepanel} = state;

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
                            onChange={() => null}/>
                </div>

                <div className={css.user}>
                    <button onClick={onAddChannelsDialog}>Channels</button>
                    <button onClick={() => onLogout(history)}>Logout</button>
                </div>
            </div>
            <div className={css.body}>
                <ChannelList className={css.channels}
                             style={{display: showSidepanel ? "flex" : "none"}}/>
                <VideoContainer className={css.video}/>
            </div>
        </div>
    )
};

const onAddChannelsDialog = async () => {
    const res = await showDialog<string | FileList>({title: 'Load playlist', children: (onSubmit, onCancel) => <LoadPlaylist onSubmit={onSubmit} onCancel={onCancel}/>});
    if(!res) return;

    const data = typeof res === "string" ? await hls.loadFromUrl(res) : await hls.loadFromFile(res);
    const channels: Array<IChannel> = data.map(i => ({...i, user_account_id: localStorageCtrl.userIdGet, channel_name: i.description}));
    await axios.post("/channel", {channels})
};


async function onLogout(history: H.History<any>){
    const res = await axios.delete("/login");
    if(!res) return;

    localStorageCtrl.tokenDelete();
    history.push("/")
}
