import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IChannel} from "../controllers/hls";

export interface IChannelState  {
    data: Array<IChannel>;
    selected: IChannel;
};

export const channelSlice = createSlice({
    name: "channel",
    initialState: {
        data: [],
        selected: null
    } as IChannelState,
    reducers: {
        load: (state, action: PayloadAction<Array<IChannel>>) => {
            state.data = action.payload
        },
        select: (state, action: PayloadAction<IChannel>) => {
            state.selected = action.payload;
        }
    }
});

