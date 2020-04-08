import {channelSlice, IChannelState} from './channel'
// import NotificationReducer from './notification'
import {combineReducers, createStore} from "redux";
import {createAction} from "@reduxjs/toolkit";

const appReducer = combineReducers({
    channel: channelSlice.reducer
    // notification: NotificationReducer
});

export interface IRootState {
    channel: IChannelState;
}

export namespace ACTIONS{
    export const Reset = createAction("Reset");
}

const rootReducer = (state, action) => {
    if(action.type === ACTIONS.Reset.type){
        state = undefined;
    }

    return appReducer(state, action)
};

export const store = createStore(
    rootReducer,
    //@ts-ignore - enable redux dev tools
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
