import * as React from "react";
import {hls, IChannel} from "../../../controllers/hls";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import {ListItemText} from "@material-ui/core";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import {cls} from "../../../../utils/function";

import css from "./channel_list.less";
import {eventDispatcher, EVENTS} from "../../../controllers/pub_sub";
import {Search} from "../../../ui/search/search";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import Avatar from "@material-ui/core/Avatar";


interface IVideoProps {
    showControls?: boolean;
    className?: string;
}

export class ChannelList extends React.Component<IVideoProps, {
    playlist: Array<IChannel>
    selectedChannel: IChannel;
}> {

    eventListener: any;
    eventListener2: any;

    constructor(props: IVideoProps, context: any) {
        super(props, context);

        this.state = {
            playlist: []
        } as any;

        this.eventListener = eventDispatcher.subscribe(EVENTS.PLAYLIST_UPDATE, this.onPlaylistUpdate);
        this.eventListener2 = eventDispatcher.subscribe(EVENTS.CHANNEL_UPDATE, this.onSelectChannel);
    }

    onPlaylistUpdate = (playlist: Array<IChannel>) => {
        this.setState({
            playlist
        })
    };

    componentWillUnmount(): void {
        this.eventListener.delete();
        this.eventListener2.delete();
    }

    async componentDidMount() {
        this.setState({
            playlist: await hls.init()
        })
    }

    render() {
        const {playlist, selectedChannel} = this.state;
        const {className} = this.props;

        return (
            <div className={cls(className)}>
                <Search placeholder={"Search"}
                        onChange={this.onSearch}/>
                <div className={css.container}>
                    <List className={css.list}>
                        {playlist && playlist.map(i => (
                            <Channel key={i.id}
                                     selected={selectedChannel ? (selectedChannel.id === i.id) : null}
                                     onClick={this.onClickChannel}
                                     item={i}/>))}
                    </List>
                </div>
            </div>
        )
    }

    onSearch = (value: string) => {
        hls.search(value);
    };

    onSelectChannel = (channel: IChannel) => {
        this.setState({
            selectedChannel: channel
        })
    };

    onClickChannel = async (channel: IChannel) => {
        await hls.loadChannel(channel);
    }
}

class Channel extends React.PureComponent<{
    item: IChannel;
    onClick: (item: IChannel) => void
    selected: boolean;
}, {}> {

    render() {
        const {item, selected} = this.props;

        return (
            <ListItem dense={true}
                      onClick={this.onClick}
                      className={cls(css.item, selected && css.selected)}>
                    <IconButton onClick={this.onClickFavorite} color={"secondary"}>
                        {item.favorite ? <FavoriteIcon/> : <FavoriteBorderIcon/>}
                    </IconButton>
                <ListItemText primary={item && item.title}
                              className={css.primary}/>
                <ListItemSecondaryAction>
                    <IconButton aria-label="Delete"
                                color={"secondary"}
                                onClick={this.onDelete}>
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

    onClickFavorite = (ev) => {
        ev.stopPropagation();
        const {item} = this.props;
        hls.toggleFavorite(item)
    }
};

