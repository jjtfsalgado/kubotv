import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IChannel} from "../controllers/playerCtrl";
import {IPlaylist} from "../controllers/playlistCtrl";

export type IChannelView = "favourites" | "all";

export interface IChannelState  {
    selected?: IChannel;
    filter?: string;
    view?: IChannelView;
    show?: boolean;
    refreshIndex: number;
    playlist?: IPlaylist
    group?: string;
};

export const channelSlice = createSlice({
    name: "channel",
    initialState: {
        refreshIndex: 0
    } as IChannelState,
    reducers: {
        select: (state, action: PayloadAction<IChannel>) => {
            state.selected = action.payload;
        },
        filter: (state, action: PayloadAction<string>) => {
            state.filter = action.payload;
        },
        view: (state, action: PayloadAction<IChannelView>) => {
            const view = action.payload;

            if(view === "favourites"){
                state.playlist = null;
                state.group = null;
                state.filter = null;
            }

            state.view = view;
            state.show = true;
        },
        show: (state, action: PayloadAction<boolean>) => {
            state.show = action.payload;

            if(!state.show){
                state.view = null;
            }
        },
        requestUpdate: (state) => {
            state.refreshIndex += 1;
        },
        selectPlaylist: (state, action: PayloadAction<IPlaylist>) => {
            state.playlist = action.payload;
            state.group = null;
            state.filter = null;
        },
        selectGroup: (state, action: PayloadAction<string>) => {
            state.group = action.payload;
            state.filter = null;
        }
    }
});

