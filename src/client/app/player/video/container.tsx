import * as React from "react";
import {useEffect, useState} from "react";
import {cls} from "../../../../utils/function";
import {Video} from "./video";
import {Typography} from "@material-ui/core";
import {eventDispatcher, EVENTS} from "../../../controllers/pub_sub";
import {useSelector} from "react-redux";
import {IRootState} from "../../../reducers";
import {IChannelState} from "../../../reducers/channel";
import {IChannel} from "../../../controllers/hls";

interface IVideoProps {
    showControls?: boolean;
    className?: string;
}

export function VideoContainer(props: IVideoProps) {
    const {className} = props;

    const selected = useSelector<IRootState, IChannel>(state => {
        return state?.channel?.selected
    });

    return (
        <div className={cls(className)}>
            <Video showControls={true} url={selected && selected.url}/>
            <div style={{flex: "0 0 40px"}}>
                {selected && (
                    <Typography variant="h6" color="secondary">
                        {selected.description}
                    </Typography>)}
            </div>
        </div>
    )
};
