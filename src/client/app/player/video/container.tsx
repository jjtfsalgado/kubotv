import * as React from "react";
import {cls} from "../../../../utils/function";
import {Video} from "./video";
import {useSelector} from "react-redux";
import {IRootState} from "../../../reducers";
import {IChannel} from "../../../controllers/playerCtrl";
import css from "./video.less";

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
            <div className={css.title} style={{flex: "0 0 40px"}}>
                {selected && (
                    <h2>{selected.description}</h2>
                )}
            </div>
        </div>
    )
};
