import {VideoContainer} from "./video/container";
import {ChannelList} from "./channels/channel_list";
import * as React from "react";
import {useEffect, useState} from "react";
import axios from "axios";
import {useHistory} from "react-router-dom"
import * as H from "history";
import localStorageCtrl from "../../controllers/localhost";
import {playerCtrl, IChannel} from "../../controllers/playerCtrl";
import {LoadPlaylist} from "./load_playlist.dialog";
import css from "./player.less";
import {SearchField} from "../../ui/search/search";
import {showDialog} from "../../ui/dialog/dialog";
import {ACTIONS, store} from "../../reducers";
import {showNotification} from "../../ui/notification/notification";
import HttpController from "../../controllers/http";
import {IProgressBarPromise} from "../../ui/busy/busy";
import {channelSlice} from "../../reducers/channel";
import {useDispatch} from "react-redux";

interface IPlayerState {
    showSidepanel: boolean;
}

export const Player = () => {
    const history = useHistory();
    const [state, setState] = useState<IPlayerState>({showSidepanel: true});
    const {showSidepanel} = state;

    const dispatch = useDispatch();
    const onToggleSidePanel = () => setState({showSidepanel: !showSidepanel});

    useEffect(() => {
        const prom = {
            description: "First",
            promise: () => new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve()
                }, 1000)
            })
        };

        const prom2 = {
            description: "Second",
            promise: () => new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve()
                }, 2000)
            })
        };

        const prom3 = {
            description: "Third",
            promise: () => new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve()
                }, 1000)
            })
        };

        const prom4 = {
            description: "Fourth",
            promise: () => new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve()
                }, 1000)
            })
        };

        showNotification({children: "Please wait", title: "yey", promises: [prom, prom2, prom3, prom4]})
    }, []);


    const onSearch = (value: string) => {
        dispatch(channelSlice.actions.filter(value?.toLowerCase()));
    };

    return (
        <div className={css.player}>
            <div className={css.header}>
                <div className={css.logo}>
                    <button onClick={() => onToggleSidePanel()}>
                        Toggle
                    </button>
                </div>
                <div className={css.search}>
                    <SearchField placeholder={"Search"}
                                 onSearch={onSearch}/>
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
    const res = await showDialog.async<string | FileList>({title: 'Load playlist', children: (onSubmit, onCancel) => <LoadPlaylist onSubmit={onSubmit} onCancel={onCancel}/>});
    if(!res) return;

    const data =  typeof res === "string" ? await playerCtrl.loadFromUrl(res) : await playerCtrl.loadFromFile(res);
    const channels: Array<IChannel> = data.map(i => ({...i, user_account_id: localStorageCtrl.userIdGet, channel_name: i.description}));
    const sliceSize = 300;

    const channelsChunks = [];
    for (let i = 0; i < channels.length; i+= sliceSize) {
        const arr = channels.slice(i, i + sliceSize);
        channelsChunks.push(arr);
    }

    const channelsChunksProms = channelsChunks.map(i => ({
        description: "Uploading channels",
        promise: async () => await HttpController.post("/channel", {channels: i})
    }));
    const loadChannels = {description: "Refreshing channel list", promise: async () => await playerCtrl.getUserChannels(localStorageCtrl.userIdGet)};

    const promises: Array<IProgressBarPromise> = [...channelsChunksProms, loadChannels];
    showNotification({title: "Loading playlist", children: "Please wait", promises});
};


async function onLogout(history: H.History<any>){
    const res = await axios.delete("/login");
    if(!res) return;

    //clear redux store data
    store.dispatch(ACTIONS.Reset());
    localStorageCtrl.tokenDelete();
    history.push("/")
}
