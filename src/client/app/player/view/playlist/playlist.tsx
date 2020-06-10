import * as React from "react";
import {useCallback} from "react";
import {GridVirtual} from "../../../../ui/grid/grid_virtual";
import {useSelector} from "react-redux";
import {IRootState, store} from "../../../../reducers";
import {channelSlice, IChannelView} from "../../../../reducers/channel";
import localStorageCtrl from "../../../../controllers/localhost";
import {IPlaylist, playlistCtrl} from "../../../../controllers/playlistCtrl";
import {FavouriteList} from "../channel/favourite_list";
import {GroupTile, GroupView} from "../group/group";
import {Breadcrumb, ILevel} from "../../../../ui/breadcrumb/breadcrumb";

interface IPlaylistViewProps {
    className?: string;
}

const rootLevel: Array<ILevel> = [{description: "Playlists", onClick: (item) => store.dispatch(channelSlice.actions.selectPlaylist(null))}]

export const PlaylistView = (props: IPlaylistViewProps) => {

    const {className} = props;

    const filter = useSelector<IRootState, string>(state => state?.channel?.filter);
    const view = useSelector<IRootState, IChannelView>(state => state?.channel?.view);
    const refreshIndex = useSelector<IRootState, number>(state => state?.channel?.refreshIndex);
    const playlist = useSelector<IRootState, IPlaylist>(state => state?.channel?.playlist);
    const userId = localStorageCtrl.userIdGet;

    const loadItems = useCallback(async () => {
        return await playlistCtrl.getUserPlaylists(userId, filter);
    }, [filter]);

    const dependencies = [refreshIndex, loadItems, view];

    if(view === "favourites") {
        return <FavouriteList className={className}/>
    }else if(playlist){
        return <GroupView playlistId={playlist.id}
                          levels={[...rootLevel, {value: playlist.id, description: playlist.description, onClick: (item) => store.dispatch(channelSlice.actions.selectGroup(null))}]}
                          className={className}/>
    }

    return (
        <>
            <Breadcrumb levels={rootLevel}/>
            <GridVirtual<IPlaylist> className={className}
                         dependencies={dependencies}
                         renderer={(item, style, index) => GroupTile(item.description, style, index, () => store.dispatch(channelSlice.actions.selectPlaylist(item)))}
                         loadItems={loadItems}/>
        </>
    )
}
