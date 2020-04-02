import {CHANNEL_ACTIONS} from "../actions/channel";
import {IChannel} from "../controllers/hls";


interface IRootState{
    channels: Array<IChannel>
}

const initialState = {
    channels: []
};

export default function NotificationReducer(state: IRootState = initialState, action){
    switch (action.type) {
        case CHANNEL_ACTIONS.LOAD_CHANNELS:
            return {
                ...state,
                channels: action.channels
            };
        default:
            return state
    }
}
