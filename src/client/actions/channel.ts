
export enum CHANNEL_ACTIONS {
    LOAD_CHANNELS = "LOAD_CHANNELS"
}

export namespace ChannelActions{
    export function load(channels) {
        return {type: CHANNEL_ACTIONS.LOAD_CHANNELS, payload: channels}
    }
}
