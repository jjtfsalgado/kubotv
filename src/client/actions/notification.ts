import {CHANNEL_ACTIONS} from "../actions/channel";
import {IChannel} from "../controllers/hls";

interface IPlayerReducerState{
    channels: Array<IChannel>
}

const initialState = {
    channels: []
};

function PlayerReducer(state: IPlayerReducerState = initialState, action){
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
