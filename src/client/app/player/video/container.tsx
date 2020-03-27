import * as React from "react";
import {useEffect, useState} from "react";
import {cls} from "../../../../utils/function";
import {Video} from "./video";
import {Typography} from "@material-ui/core";
import {eventDispatcher, EVENTS} from "../../../controllers/pub_sub";

interface IVideoProps {
    showControls?: boolean;
    className?: string;
}

export function VideoContainer(props: IVideoProps) {
    const {className} = props;
    const [state, setState] = useState<any>({});
    const {selectedChannel} = state;

    useEffect( () => {
        let even = eventDispatcher.subscribe(EVENTS.CHANNEL_UPDATE, (value) => {
            setState({selectedChannel: value})
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
