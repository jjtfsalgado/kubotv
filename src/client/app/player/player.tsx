import {VideoContainer} from "./video/container";
import * as React from "react";
import {useEffect} from "react";
import axios from "axios";
import localStorageCtrl from "../../controllers/localhost";
import {LoadPlaylist} from "./load_playlist.dialog";
import css from "./player.less";
import {SearchField} from "../../ui/search/search";
import {showDialog} from "../../ui/dialog/dialog";
import {ACTIONS, IRootState, store} from "../../reducers";
import {showNotification} from "../../ui/notification/notification";
import HttpController from "../../controllers/http";
import {IProgressBarPromise} from "../../ui/busy/busy";
import {channelSlice, IChannelView} from "../../reducers/channel";
import {useDispatch, useSelector} from "react-redux";
import {IGroup, SideBar} from "./sidebar/sidebar";
import Logo from '../../assets/icons/logo.png';
import {StarSvg} from "../../assets/icons/star";
import {PlusSvg} from "../../assets/icons/plus";
import {ExitSvg} from "../../assets/icons/exit";
import {ArrowLeft} from "../../assets/icons/arrow_left";
import {ConfirmDialog} from "../../ui/dialog/variants/confirm";
import {readFile} from "../../../utils/function";
import {PlaylistView} from "./view/playlist/playlist";

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
        icon: <StarSvg size={28}/>,
        onClick: () => store.dispatch(channelSlice.actions.view("favourites"))
    },
    {
        id: "create",
        description: "Add channels",
        icon: <PlusSvg size={28}/>,
        position: "end",
        type: "primary",
        onClick: () => addChannelsDialog()
    },
    {
        id: "logout",
        description: "Logout",
        icon: <ExitSvg size={28}/>,
        onClick: onLogout
    }
];

export default function Player () {
    const dispatch = useDispatch();

    const show = useSelector<IRootState, Partial<boolean>>(state => state?.channel?.show);
    const view = useSelector<IRootState, Partial<IChannelView>>(state => state?.channel?.view);

    useEffect(() => {
        store.dispatch(channelSlice.actions.view("all"));
    }, []);

    const onSearch = (value: string) => dispatch(channelSlice.actions.filter(value?.toLowerCase()));

    return (
        <div className={css.player}>
            <SideBar data={groups}
                     selected={view}
                     className={css.sidebar}/>
            <div className={css.body}>
                <div className={css.channels} style={{display: show ? "flex" : "none"}}>
                    <SearchField placeholder={"Search"}
                                 className={css.search}
                                 onSearch={onSearch}/>
                    <PlaylistView className={css.list}/>
                    {show && (
                        <div className={css.hide} onClick={() => dispatch(channelSlice.actions.show(false))}>
                            <ArrowLeft color={"#b3b3b3"}/>
                        </div>
                    )}
                </div>
                <VideoContainer className={css.video}/>
            </div>
        </div>
    )
};

const addChannelsDialog = async () => {
    const res = await showDialog.async<{data: string | FileList, description: string, type: "url" | "file"}>({title: 'Load playlist', children: (onSubmit, onCancel) => <LoadPlaylist onSubmit={onSubmit} onCancel={onCancel}/>});
    if(!res || !res.data) return;
    const userAccountId = localStorageCtrl.userIdGet;

    // const playlistId = newGuid();
    // const sliceSize = 10;

    if(typeof res.data !== "string"){
        const file = await readFile(res.data);
        res.data = file as any
        res.type = "file";
    }

    const channelsChunksProms = {
        description: "Uploading channels",
        promise: async () => await HttpController.post(`/channel/${userAccountId}`, {file: res})
    };

    const loadChannels = {description: "Refreshing channel list", promise: async () => await Promise.resolve(store.dispatch(channelSlice.actions.requestUpdate()))};
    const promises: Array<IProgressBarPromise> = [channelsChunksProms, loadChannels];
    showNotification({title: "Loading playlist", promises});
};


async function onLogout(){
    const confirmed = await showDialog.async({title: "Sign out", children: (onSubmit, onCancel) => <ConfirmDialog onSubmit={onSubmit} onCancel={onCancel} message={"Are you sure you want to leave?"}/>});
    if(!confirmed) return;

    const res = await axios.delete("/login");
    if(!res) return;

    //clear redux store data
    store.dispatch(ACTIONS.Reset());
    localStorageCtrl.tokenDelete();
    window.location.href = "/#/"
}
