import * as React from "react";
import {useEffect, useReducer} from "react";
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
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import {reducer} from "../../login/login";

interface IVideoProps {
    showControls?: boolean;
    className?: string;
}

export function ChannelList(props: IVideoProps){
    const {showControls, className} = props;
    const [state, dispatch] = useReducer(reducer, {playlist: []});
    const {playlist, selectedChannel} = state;

    const onPlaylistUpdate = async (playlist: Array<IChannel>) => {
        await hls.loadChannel(playlist[0]);

        dispatch({property: "playlist", value: playlist})
    };

    const onSelectChannel = (channel: IChannel) => {
        dispatch({property: selectedChannel, value: playlist})
    };

    useEffect(() => {
        const eventListener = eventDispatcher.subscribe(EVENTS.PLAYLIST_UPDATE, onPlaylistUpdate);
        const eventListener2 = eventDispatcher.subscribe(EVENTS.CHANNEL_UPDATE, onSelectChannel);

        return () => {
            eventListener.delete();
            eventListener2.delete();
        }
    }, []);

    const onClickChannel = async (channel: IChannel) => {
        await hls.loadChannel(channel);
    };

    return (
        <div className={cls(className)}>
            <div className={css.container}>
                <List className={css.list}>
                    {playlist && playlist.map(i => (
                        <Channel key={i.id}
                                 selected={selectedChannel ? (selectedChannel.id === i.id) : null}
                                 onClick={onClickChannel}
                                 item={i}/>))}
                </List>
            </div>
        </div>
    )
}


function Channel(props) {
    const {item, selected} = props;

    const onClick = () => {
        const {onClick, item} = props;
        onClick(item)
    };

    const onDelete = () => {
        const {item} = props;
        hls.deleteChannel(item)
    };

    const onClickFavorite = (ev) => {
        ev.stopPropagation();
        const {item} = props;
        hls.toggleFavorite(item)
    };

    return (
        <ListItem dense={true}
                  onClick={onClick}
                  className={cls(css.item, selected && css.selected)}>
            <IconButton onClick={onClickFavorite} color={"secondary"}>
                {item.favorite ? <FavoriteIcon/> : <FavoriteBorderIcon/>}
            </IconButton>
            <ListItemText primary={item && item.description}
                          className={css.primary}/>
            <ListItemSecondaryAction>
                <IconButton aria-label="Delete"
                            color={"secondary"}
                            onClick={onDelete}>
                    <DeleteIcon/>
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    )
}



