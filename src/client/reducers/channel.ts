import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IChannel} from "../controllers/hls";

export interface IChannelState  {
    selected: IChannel;
};

export const channelSlice = createSlice({
    name: "channel",
    initialState: {
        selected: null
    } as IChannelState,
    reducers: {
        select: (state, action: PayloadAction<IChannel>) => {
            state.selected = action.payload;
        }
    }
});

