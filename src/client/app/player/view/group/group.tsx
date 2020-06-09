import * as React from "react";
import {useCallback} from "react";
import {GridVirtual} from "../../../../ui/grid/grid_virtual";
import {useSelector} from "react-redux";
import {IRootState, store} from "../../../../reducers";
import localStorageCtrl from "../../../../controllers/localhost";
import {IGroupPlaylist, playlistCtrl} from "../../../../controllers/playlistCtrl";

import css from "../playlist/playlist.less"
import {ChannelList, Initials} from "../channel/channel_list";
import {Breadcrumb, ILevel} from "../../../../ui/breadcrumb/breadcrumb";
import {channelSlice} from "../../../../reducers/channel";

interface IGroupViewProps {
    className?: string;
    playlistId: string;
    levels?: Array<ILevel>;
}

export const GroupView = (props: IGroupViewProps) => {
    const {className, playlistId, levels} = props;

    const filter = useSelector<IRootState, string>(state => state?.channel?.filter);
    const group = useSelector<IRootState, string>(state => state?.channel?.group);

    const userId = localStorageCtrl.userIdGet;

    const loadGroups = useCallback(async () => {
        return await playlistCtrl.getPlaylistGroups(userId, playlistId, filter);
    }, [filter, playlistId])

    const dependencies = [loadGroups];

    if(group){
        return <ChannelList className={className}
                            group={group}
                            levels={[...levels, {onClick: (item) => store.dispatch(channelSlice.actions.selectGroup(item.value)), value: group, description: group}]}
                            playlistId={playlistId}/>
    }

    const onClick = (item) => {
        store.dispatch(channelSlice.actions.selectGroup(item.group_title))
    }

    return (
        <>
            <Breadcrumb levels={levels}/>
            <GridVirtual<IGroupPlaylist> className={className}
                                        dependencies={dependencies}
                                        renderer={(item, style, index) => GroupTile(item, style, index, onClick)}
                                        loadItems={loadGroups}/>
        </>
    )
}

const GroupTile = (item: IGroupPlaylist, style, index, onClick) => {

    return (
        <div className={css.playlist} style={style} onClick={(ev) => onClick(item)}>
            <Initials className={css.icon} description={item.group_title}/>
            <span className={css.description}>{item.group_title}</span>
        </div>
    )
}


