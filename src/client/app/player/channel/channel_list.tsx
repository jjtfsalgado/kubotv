import * as React from "react";
import {CSSProperties, useCallback, useRef, useState} from "react";
import {IChannel, playerCtrl} from "../../../controllers/playerCtrl";
import css from "./channel_list.less";
import {cls} from "../../../../utils/function";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "../../../reducers";
import {channelSlice, IChannelState} from "../../../reducers/channel";
import localStorageCtrl from "../../../controllers/localhost";
import {ListVirtual} from "../../../ui/list/list_virtual";
import MenuIcon from '../../../assets/icons/menu.svg';
import {ContextMenu, IMenuItem} from "../../../ui/menu/menu";

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


const ChannelItemMenu: Array<IMenuItem> = [
    {description: "Add to favourites", type: "action"},
    {type: "separator"},
    {description: "Delete channel", type: "action"}
];

const ChannelItem = (props: IChannelItemProps) => {
    const {item, isSelected, style, index} = props;

    const dispatch = useDispatch();
    const [show, showButton] = useState(false);

    const onClick = (ev) => dispatch(channelSlice.actions.select(item));
    const onMouseEnter = () => showButton(true);
    const onMouseLeave = () => showButton(false);


    return (
        <div className={cls(css.channel, isSelected && css.selected)}
             style={style}
             onMouseEnter={onMouseEnter}
             onMouseLeave={onMouseLeave}
             onClick={onClick}>
            <span>{index}  {item?.description}  {item?.is_favourite}</span>
            {show && (
                <ContextMenu items={ChannelItemMenu} eventType={"click"}>
                    {(ref) => (
                        <button ref={ref} className={css.button}>
                            <img src={MenuIcon} style={{width: 15, height: 15}}/>
                        </button>
                    )}
                </ContextMenu>
            )}
        </div>
    )
};
