import * as React from "react";
import {hls, IChannel} from "../../controllers/hls";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import {ListItemText} from "@material-ui/core";
import ToolBar from "./toolbar"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import FolderIcon from "@material-ui/icons/Folder";
import {cls} from "../../utils/function";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";

import css from "./channel_list.less";

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
        const {className} = this.props;

        return (
            <div className={cls(className)}>
                <ToolBar/>
                <div className={css.container}>
                    <List className={css.list}>
                        {playlist && playlist.map(i => <Channel key={i.id} onClick={this.onClickChannel} item={i}/>)}
                    </List>
                </div>
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
            <ListItem>
                <ListItemAvatar>
                    <Avatar>
                        <FolderIcon />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={item && item.title}
                              onClick={this.onClick}/>
                <ListItemSecondaryAction>
                    <IconButton aria-label="Delete" onClick={this.onDelete}>
                        <DeleteIcon/>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
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

