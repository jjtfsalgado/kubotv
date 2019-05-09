import * as React from "react";
import axios from "axios";
import css from "./channel_list.less";
import {hls} from "../controllers/hls";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import {ListItemText} from "@material-ui/core";

interface IVideoProps {
    showControls?: boolean;
    className?: string;
}

const dataChannels = [
{
    description: "Test",
    id: "Test",
    url: 'http://video-auth1.iol.pt:1935/beachcam/arrifana/chunks.m3u8'
},
{
    description: "Test",
    id: "Test",
    url: 'http://video-auth1.iol.pt:1935/beachcam/arrifana/chunks.m3u8'
},
{
    description: "Test",
    id: "Test",
    url: 'http://video-auth1.iol.pt:1935/beachcam/arrifana/chunks.m3u8'
}
];

export class ChannelList extends React.Component<IVideoProps, {}> {
    async componentDidMount(){
        // var xhr = new XMLHttpRequest();
        const response = await axios.get("https://raw.githubusercontent.com/freearhey/iptv/master/channels/pt.m3u")
        const playlist = this.parse(response.data)
        console.log(playlist)



        // xhr.open("GET", );
        // xhr.setRequestHeader( 'Access-Control-Allow-Origin', '*');
        // // xhr.overrideMimeType("audio/x-mpegurl"); // Needed, see below.
        // // xhr.onload = this.parse;
        // xhr.send();
        //
        // console.log(xhr.response)
    }

    parse = (data: string) => {

        var playlist = window.M3U.parse(data);
    };

    render() {
        return (
            <List>
                {dataChannels.map(i => <Channel {...i}/>)}
            </List>
        )
    }
}

interface IChannelProps{
    description: string;
    url: string;
    id: string;
}

const Channel = (props: IChannelProps) => {
    return (
        <ListItem>
            <ListItemText primary={props.description}/>
        </ListItem>
    )
}