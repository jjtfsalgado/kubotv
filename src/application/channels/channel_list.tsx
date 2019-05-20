import * as React from "react";
import {hls, IChannel} from "../../controllers/hls";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import {ListItemText} from "@material-ui/core";
import ToolBar from "./toolbar"

interface IVideoProps {
    showControls?: boolean;
    className?: string;
}

export class ChannelList extends React.Component<IVideoProps, {
    playlist: Array<IChannel>
}> {
    constructor(props: IVideoProps, context: any) {
        super(props, context);

        this.state = {
            playlist: []
        };
        hls.register = (playlist:Array<IChannel>) => this.setState({playlist});
    }

    async componentDidMount() {
        this.setState({
            playlist: await hls.init()
        })
    }

    render() {
        const {playlist} = this.state;

        return (
            <div>
                <ToolBar/>
                <List>
                    {playlist && playlist.map(i => <Channel onClick={this.onClickChannel} {...i}/>)}
                </List>
            </div>
        )
    }

    onClickChannel = async (channel: IChannel) => {
        await hls.loadChannel(channel.url);
    }
}

const Channel = (props: IChannel & { onClick: (item: IChannel) => void }) => {
    return (
        <ListItem>
            <ListItemText primary={props.title} onClick={() => props.onClick(props)}/>
        </ListItem>
    )
};

