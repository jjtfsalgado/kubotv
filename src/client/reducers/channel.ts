import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IChannel} from "../controllers/playerCtrl";

export type IChannelView = "favourites" | "all" | "new";

export interface IChannelState  {
    selected?: IChannel;
    filter?: string;
    view?: IChannelView;
    show?: boolean;
    refreshIndex: number;
};

export const channelSlice = createSlice({
    name: "channel",
    initialState: {
        // selected: null,
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
            state.view = action.payload;
            state.show = true;
        },
        toggle: (state) => {
            state.show = !state.show;
        },
        requestUpdate: (state) => {
            state.refreshIndex += 1;
        }
    }
});

