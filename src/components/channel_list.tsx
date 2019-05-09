import * as React from "react";
import axios from "axios";
import css from "./channel_list.less";
import {hls} from "../controllers/hls";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import {ListItemText} from "@material-ui/core";
import {m3uToJson} from "../utils/m3u_json_parser";

interface IVideoProps {
    showControls?: boolean;
    className?: string;
}

interface IChannel{
    'group-title': string;
    title: string;
    'tvg-id': string
    'tvg-logo': string
    'tvg-name': string;
    url: string;
}

export class ChannelList extends React.Component<IVideoProps, {
    playlist: Array<IChannel>
}> {
    constructor(props: IVideoProps, context: any) {
        super(props, context);

        this.state = {
            playlist: []
        }
    }

    async componentDidMount(){
        const response = await axios.get("https://raw.githubusercontent.com/freearhey/iptv/master/channels/pt.m3u");

        this.setState({
            playlist: m3uToJson(response.data)
        })
    }

    render() {
        const {playlist} = this.state;

        return (
            <List>
                {playlist.map(i => <Channel onClick={this.onClickChannel} {...i}/>)}
            </List>
        )
    }

    onClickChannel = (channel: IChannel) => {
        hls.loadSource(channel.url, 'video');
    }
}

const Channel = (props: IChannel & {onClick: (item: IChannel) => void}) => {
    return (
        <ListItem>
            <ListItemText primary={props.title} onClick={() => props.onClick(props)}/>
        </ListItem>
    )
};