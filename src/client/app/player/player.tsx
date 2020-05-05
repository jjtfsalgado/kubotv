import {VideoContainer} from "./video/container";
import {ChannelList} from "./channel/channel_list";
import * as React from "react";
import {useEffect} from "react";
import axios from "axios";
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
import {channelSlice, IChannelState, IChannelView} from "../../reducers/channel";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {GroupBar, IGroup} from "./group/group";
import Logo from '../../assets/icons/logo.png';
import Arrow from '../../assets/icons/arrow_left.svg';
import {StarSvg} from "../../assets/icons/star";
import {RecentSvg} from "../../assets/icons/history";
import {PlusSvg} from "../../assets/icons/plus";
import {ExitSvg} from "../../assets/icons/exit";
import {ArrowLeft} from "../../assets/icons/arrow_left";

const groups: Array<IGroup> = [
    {
        id: "all",
        description: "Home",
        icon: <img alt={"logo"} src={Logo} style={{width: 28}}/>,
        onClick: () => store.dispatch(channelSlice.actions.view("all"))
    },
    {
        id: "favourites",
        description: "Favourites",
        icon: <StarSvg size={28} color={"#b3b3b3"}/>,
        onClick: () => store.dispatch(channelSlice.actions.view("favourites"))
    },
    {
        id: "new",
        description: "New",
        icon: <RecentSvg size={28} color={"#b3b3b3"}/>,
        onClick: () => store.dispatch(channelSlice.actions.view("new"))
    },
    {
        id: "create",
        description: "Add channels",
        icon: <PlusSvg size={28} color={"#b3b3b3"}/>,
        position: "end",
        onClick: () => addChannelsDialog()
    },
    {
        id: "logout",
        description: "Logout",
        icon: <ExitSvg size={28} color={"#b3b3b3"}/>,
        onClick: onLogout
    }
];

export const Player = () => {
    const dispatch = useDispatch();

    const show = useSelector<IRootState, Partial<boolean>>(state => state?.channel?.show);
    const view = useSelector<IRootState, Partial<IChannelView>>(state => state?.channel?.view);

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
            <GroupBar data={groups}
                      selected={view}
                      className={css.sidebar}/>
            <div className={css.channels} style={{display: show ? "flex" : "none"}}>
                <SearchField placeholder={"Search"}
                             className={css.search}
                             onSearch={onSearch}/>
                <ChannelList className={css.list}/>
                {show && (
                    <div className={css.hide} onClick={() => dispatch(channelSlice.actions.show(false))}>
                        <ArrowLeft color={"#b3b3b3"}/>
                    </div>
                )}
            </div>
            <div className={css.body}>
                <VideoContainer className={css.video}/>
            </div>
        </div>
    )
};

const addChannelsDialog = async () => {
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

    const loadChannels = {description: "Refreshing channel list", promise: async () => await Promise.resolve(store.dispatch(channelSlice.actions.requestUpdate()))};
    const promises: Array<IProgressBarPromise> = [...channelsChunksProms, loadChannels];
    showNotification({title: "Loading playlist", children: "Please wait", promises});
};


async function onLogout(){
    const res = await axios.delete("/login");
    if(!res) return;

    //clear redux store data
    store.dispatch(ACTIONS.Reset());
    localStorageCtrl.tokenDelete();
    window.location.href = "/#/"
}
