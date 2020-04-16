import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IChannel} from "../controllers/playerCtrl";

export interface IChannelState  {
    selected: IChannel;
    filter: string;
};

export const channelSlice = createSlice({
    name: "channel",
    initialState: {
        selected: null
    } as Partial<IChannelState>,
    reducers: {
        select: (state, action: PayloadAction<IChannel>) => {
            state.selected = action.payload;
        },
        filter: (state, action: PayloadAction<string>) => {
            state.filter = action.payload;
        }
    }
});

