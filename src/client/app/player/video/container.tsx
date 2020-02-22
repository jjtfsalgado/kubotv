import * as React from "react";
import {useEffect, useReducer} from "react";
import {cls} from "../../../../utils/function";
import {Video} from "./video";
import {Typography} from "@material-ui/core";
import {eventDispatcher, EVENTS} from "../../../controllers/pub_sub";
import {reducer} from "../../login/login";

interface IVideoProps {
    showControls?: boolean;
    className?: string;
}

export function VideoContainer(props: IVideoProps) {

    const {className} = props;
    const [state, dispatch] = useReducer(reducer, {});
    const {selectedChannel} = state;

    useEffect( () => {
        let even = eventDispatcher.subscribe(EVENTS.CHANNEL_UPDATE, (value) => {
            dispatch({property: "selectedChannel", value})
        });

        return () => even.delete();
    }, []);

    return (
        <div className={cls(className)}>
            <Video showControls={true} url={selectedChannel && selectedChannel.url}/>
            <div style={{flex: "0 0 40px"}}>
                {selectedChannel && (
                    <Typography variant="h6" color="secondary">
                        {selectedChannel.title}
                    </Typography>)}
            </div>
        </div>
    )
};


// export class VideoContainer extends React.Component<IVideoProps, {
//     selectedChannel: IChannel;
// }> {
//     private eventListener: { delete: () => void };
//
//     constructor(props: IVideoProps, context: any) {
//         super(props, context);
//
//         this.state = {} as any;
//
//         this.eventListener = eventDispatcher.subscribe(EVENTS.CHANNEL_UPDATE, this.onChannelUpdate)
//     }
//
//     onChannelUpdate = (channel: IChannel) => {
//         this.setState({
//             selectedChannel: channel
//         })
//     };
//
//     render() {
//         const {className} = this.props;
//         const {selectedChannel} = this.state;
//
//         return [
//
//         ]
//     }
// }
