import * as React from "react";
import {useCallback} from "react";
import {GridVirtual} from "../../../../ui/grid/grid_virtual";
import {useSelector} from "react-redux";
import {IRootState, store} from "../../../../reducers";
import localStorageCtrl from "../../../../controllers/localhost";
import {IGroupPlaylist, playlistCtrl} from "../../../../controllers/playlistCtrl";

import css from "./group.less"
import {ChannelList, Initials} from "../channel/channel_list";
import {Breadcrumb, ILevel} from "../../../../ui/breadcrumb/breadcrumb";
import {channelSlice} from "../../../../reducers/channel";
import {cls} from "../../../../../utils/function";

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
        const groups = await playlistCtrl.getPlaylistGroups(userId, playlistId, filter);

        return [{group_title: "All"},...groups] as Array<IGroupPlaylist>;
    }, [filter, playlistId])

    const dependencies = [loadGroups];

    if(group){
        return <ChannelList className={className}
                            group={group}
                            levels={[...levels, {onClick: (item) => store.dispatch(channelSlice.actions.selectGroup(item.value)), value: group, description: group}]}
                            playlistId={playlistId}/>
    }

    const onClick = (item) => store.dispatch(channelSlice.actions.selectGroup(item.group_title));

    return (
        <>
            <Breadcrumb levels={levels}/>
            <GridVirtual<IGroupPlaylist> className={className}
                                        dependencies={dependencies}
                                        renderer={(item, style, index) => GroupTile(item.group_title, style, index, () => onClick(item))}
                                        loadItems={loadGroups}/>
        </>
    )
}

export const GroupTile = (description: string, style, index, onClick) => {

    const isAll = description === "All" && index === 0;

    return (
        <div className={css.tile} style={style} onClick={onClick}>
            {!isAll && (
                <div className={css.content}>
                    <Initials className={css.icon} description={description}/>
                    <span className={css.description}>{description}</span>
                </div>
                )
            }
            {isAll && (
                <div className={cls(css.content)}>
                    <span style={{fontWeight: "bold"}}>{description}</span>
                </div>
            )}
        </div>
    )
}


