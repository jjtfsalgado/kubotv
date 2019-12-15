import * as React from "react";
import {cls} from "../../../../utils/function";
import {Video} from "./video";
import {Typography} from "@material-ui/core";
import {IChannel} from "../../../controllers/hls";
import {eventDispatcher, EVENTS} from "../../../controllers/pub_sub";
import {Ad} from "../../../ui/ads/ad";

interface IVideoProps {
    showControls?: boolean;
    className?: string;
}

export class VideoContainer extends React.Component<IVideoProps, {
    selectedChannel: IChannel;
}> {
    private eventListener: { delete: () => void };

    constructor(props: IVideoProps, context: any) {
        super(props, context);

        this.state = {} as any;

        this.eventListener = eventDispatcher.subscribe(EVENTS.CHANNEL_UPDATE, this.onChannelUpdate)
    }

    onChannelUpdate = (channel: IChannel) => {
        this.setState({
            selectedChannel: channel
        })
    };

    render() {
        const {className} = this.props;
        const {selectedChannel} = this.state;

        return [
            <div className={cls(className)}>
                <Video showControls={true}/>
                <div>
                    {selectedChannel && (
                        <Typography variant="h6" color="secondary">
                            {selectedChannel.title}
                        </Typography>)}
                </div>
            </div>
        ]
    }
}
