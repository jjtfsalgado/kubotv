import * as React from "react";
import {hls, IChannel} from "../../controllers/hls";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import {ListItemText} from "@material-ui/core";
import ToolBar from "./toolbar"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

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
        hls.register = (playlist: Array<IChannel>) => this.setState({playlist});
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
                    {playlist && playlist.map(i => <Channel onClick={this.onClickChannel} item={i} />)}
                </List>
            </div>
        )
    }

    onClickChannel = async (channel: IChannel) => {
        await hls.loadChannel(channel.url);
    }
}

class Channel extends React.PureComponent<{
    item: IChannel;
    onClick: (item: IChannel) => void
}, {}> {

    render() {
        const {item} = this.props;

        return (
            <div>
                <ListItem>
                    <ListItemText primary={item && item.title}
                                  onClick={this.onClick}/>
                    <ListItemSecondaryAction>
                        <IconButton aria-label="Delete" onClick={this.onDelete}>
                            <DeleteIcon/>
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            </div>
        )
    }

    onClick = () => {
        const {onClick, item} = this.props;
        onClick(item)
    };

    onDelete = () => {
        const {item} = this.props;
        hls.deleteChannel(item)
    };
};

