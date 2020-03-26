import * as React from "react";
import {useEffect, useReducer} from "react";
import {hls, IChannel} from "../../../controllers/hls";
import {eventDispatcher, EVENTS} from "../../../controllers/pub_sub";
import {reducer} from "../../login/login";
import {List} from "../../../ui/list/list";
import css from "./channel_list.less";

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

    const onItemRender = (item) => (
        <Channel key={item.id}
                 selected={selectedChannel ? (selectedChannel.id === item.id) : null}
                 onClick={onClickChannel}
                 item={item}/>
    );

    return (
        <List className={css.list}
              title={"Channels"}
              data={playlist}
              itemRender={onItemRender}/>
    );
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
        <div className={css.channel}
             onClick={onClick}>
            <span>{item && item.description}</span>
        </div>
    )
}

// <ListItem dense={true}
//           onClick={onClick}
//           className={cls(css.item, selected && css.selected)}>
//     <IconButton onClick={onClickFavorite} color={"secondary"}>
//         {item.favorite ? <FavoriteIcon/> : <FavoriteBorderIcon/>}
//     </IconButton>
//     <ListItemText primary={item && item.description}
//                   className={css.primary}/>
//     <ListItemSecondaryAction>
//         <IconButton aria-label="Delete"
//                     color={"secondary"}
//                     onClick={onDelete}>
//             <DeleteIcon/>
//         </IconButton>
//     </ListItemSecondaryAction>
// </ListItem>

