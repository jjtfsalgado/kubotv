import {channelSlice, IChannelState} from './channel'
import NotificationReducer from './notification'
import {combineReducers, createStore} from "redux";

const rootReducer = combineReducers({
    channel: channelSlice.reducer,
    notification: NotificationReducer
});

export interface IRootState {
    channel: IChannelState;
}

export const store = createStore(rootReducer);
