import * as React from "react";
import {useCallback} from "react";
import {IChannel, playerCtrl} from "../../../../controllers/playerCtrl";
import {useSelector} from "react-redux";
import {IRootState} from "../../../../reducers";
import localStorageCtrl from "../../../../controllers/localhost";
import {ListVirtual} from "../../../../ui/list/list_virtual";
import {ChannelItem} from "./channel_list";

interface IChannelListProps {
    className?: string;
}

export const FavouriteList = (props: IChannelListProps) => {
    const {className} = props;

    const filter = useSelector<IRootState, string>(state => state?.channel?.filter);

    const onRenderItem = useCallback((item, style, index) => (
        <ChannelItem key={item?.id}
                     index={index + 1}
                     style={style}
                     item={item}/>
    ), []);

    const loadItems = useCallback(async (start, stop) => {
        return await playerCtrl.getUserFavourites(localStorageCtrl.userIdGet, (stop + 1) - start, start, filter);
    }, [filter]);

    const loadTotal = useCallback(async () => {
        return await playerCtrl.getUserFavouritesTotal(localStorageCtrl.userIdGet, filter)
    }, [filter]);

    const dependencies = [loadItems];

    return (
        <ListVirtual<IChannel> renderer={onRenderItem}
                               className={className}
                               dependencies={dependencies}
                               loadTotal={loadTotal}
                               loadItems={loadItems}/>
    );
};
