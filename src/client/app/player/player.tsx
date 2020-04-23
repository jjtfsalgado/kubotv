import {VideoContainer} from "./video/container";
import {ChannelList} from "./channel/channel_list";
import * as React from "react";
import {useEffect} from "react";
import axios from "axios";
import {useHistory} from "react-router-dom"
import * as H from "history";
import localStorageCtrl from "../../controllers/localhost";
import {IChannel, playerCtrl} from "../../controllers/playerCtrl";
import {LoadPlaylist} from "./load_playlist.dialog";
import css from "./player.less";
import {SearchField} from "../../ui/search/search";
import {showDialog} from "../../ui/dialog/dialog";
import {ACTIONS, IRootState, store} from "../../reducers";
import {showNotification} from "../../ui/notification/notification";
import HttpController from "../../controllers/http";
import {IProgressBarPromise} from "../../ui/busy/busy";
import {channelSlice, IChannelState} from "../../reducers/channel";
import {useDispatch, useSelector} from "react-redux";
import {GroupBar, IGroup} from "./group/group";


const Groups: Array<IGroup> = [
    {
        description: "Home",
        icon: "H",
        onClick: () => store.dispatch(channelSlice.actions.view("all"))
    },
    {
        description: "Favourites",
        icon: "F",
        onClick: () => store.dispatch(channelSlice.actions.view("favourites"))
    },
    {
        description: "New",
        icon: "N",
        onClick: () => store.dispatch(channelSlice.actions.view("new"))
    }
];

export const Player = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const {show} = useSelector<IRootState, IChannelState>(state => {
        return state?.channel
    });

    useEffect(() => {
        store.dispatch(channelSlice.actions.view("all"));

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

    const onSearch = (value: string) => dispatch(channelSlice.actions.filter(value?.toLowerCase()));

    return (
        <div className={css.player}>
            <GroupBar data={Groups}
                      className={css.sidebar}/>
            <div className={css.channels} style={{display: show ? "flex" : "none"}}>
                <SearchField placeholder={"Search"}
                             className={css.search}
                             onSearch={onSearch}/>
                <ChannelList className={css.list}/>
            </div>
            <div className={css.body}>
                <div className={css.user}>
                    <button onClick={onAddChannelsDialog}>Channels</button>
                    <button onClick={() => onLogout(history)}>Logout</button>
                </div>
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

    const promises: Array<IProgressBarPromise> = channelsChunks.map(i => ({
        description: "Uploading channels",
        promise: async () => await HttpController.post("/channel", {channels: i})
    }));

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
