import * as React from "react";
import {cls} from "../../utils/function";

// import css from "./channel_list.less";
import {Video} from "./video";
import {Typography} from "@material-ui/core";

interface IVideoProps {
    showControls?: boolean;
    className?: string;
}

export class VideoContainer extends React.Component<IVideoProps, {
}> {
    render() {
        const {className} = this.props;

        return (
            <div className={cls(className)}>
                <Typography variant="h6" color="inherit">
                    Header
                </Typography>
                <div>
                    <Video showControls={true}/>
                </div>
            </div>
        )
    }
}