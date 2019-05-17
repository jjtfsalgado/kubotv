import * as React from "react";
import axios from "axios";
import {hls, IChannel} from "../../controllers/hls";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import {ListItemText} from "@material-ui/core";
import {m3uToJson} from "../../utils/m3u_json_parser";
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
        const playlist = await hls.loadPlaylist("https://raw.githubusercontent.com/freearhey/iptv/master/channels/pt.m3u");
        this.setState({
            playlist
        })
    }

    render() {
        const {playlist} = this.state;

        return (
            <div>
                <ToolBar/>
                <List>
                    {playlist.map(i => <Channel onClick={this.onClickChannel} {...i}/>)}
                </List>
            </div>
        )
    }

    onClickChannel = (channel: IChannel) => {
        hls.loadChannel(channel.url, 'video');
    }
}

const Channel = (props: IChannel & { onClick: (item: IChannel) => void }) => {
    return (
        <ListItem>
            <ListItemText primary={props.title} onClick={() => props.onClick(props)}/>
        </ListItem>
    )
};

