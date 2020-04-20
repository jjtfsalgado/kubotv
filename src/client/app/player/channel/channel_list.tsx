import * as React from "react";
import {CSSProperties, useCallback} from "react";
import {IChannel, playerCtrl} from "../../../controllers/playerCtrl";
import css from "./channel_list.less";
import {cls} from "../../../../utils/function";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "../../../reducers";
import {channelSlice, IChannelState} from "../../../reducers/channel";
import localStorageCtrl from "../../../controllers/localhost";
import {ListVirtual} from "../../../ui/list/list_virtual";

interface IChannelListProps {
    className?: string;
}

export const ChannelList = (props: IChannelListProps) => {
    const {className} = props;

    const {selected, filter, view} = useSelector<IRootState, IChannelState>(state => {
        return state?.channel
    });

    const onRenderItem = (item, style, index) => (
            <ChannelItem key={item?.id}
                            index={index + 1}
                            style={style}
                            isSelected={item?.id === selected?.id}
                            item={item}/>
    );

    const loadItems = async (start, stop) => await playerCtrl.getUserChannels(localStorageCtrl.userIdGet, (stop + 1) - start, start, filter, view);
    const loadItemsTotal = async () => await playerCtrl.getUserChannelsTotal(localStorageCtrl.userIdGet, filter, view);

    return (
        <ListVirtual<IChannel> renderer={onRenderItem}
                               className={className}
                               dependencies={[filter, view]}
                               selected={selected}
                               loadItemsTotal={loadItemsTotal}
                               loadItems={loadItems}/>
    );
};

interface IChannelItemProps {
    item: IChannel;
    isSelected?: boolean;
    style?: Partial<CSSProperties>;
    index: number;
}

const ChannelItem = (props: IChannelItemProps) => {
    const {item, isSelected, style, index} = props;
    const dispatch = useDispatch();

    const onClick = () => {
        dispatch(channelSlice.actions.select(item));
    };

    return (
        <div className={cls(css.channel, isSelected && css.selected)}
             style={style}
             onClick={onClick}>
            <span>{index}  {item && item.description}</span>
        </div>
    )
};
