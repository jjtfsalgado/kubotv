import * as React from "react";
import {CSSProperties, useEffect, useState} from "react";
import {IChannel, playerCtrl} from "../../../controllers/playerCtrl";
import css from "./channel_list.less";
import {cls, throttle} from "../../../../utils/function";
import {useDispatch, useSelector} from "react-redux";
import {IRootState, store} from "../../../reducers";
import {channelSlice, IChannelState} from "../../../reducers/channel";
import localStorageCtrl from "../../../controllers/localhost";
import {ListVirtual} from "../../../ui/list/list_virtual";
import MenuIcon from '../../../assets/icons/menu.svg';
import {ContextMenu, IMenuItem} from "../../../ui/menu/menu";
import HttpController from "../../../controllers/http";
import {showDialog} from "../../../ui/dialog/dialog";
import {ConfirmDialog} from "../../../ui/dialog/variants/confirm";
import Favorite from '../../../assets/icons/favorite.svg';

interface IChannelListProps {
    className?: string;
}

interface IChannelListState {
    total: number;
}

export const ChannelList = (props: IChannelListProps) => {
    const {className} = props;
    const [state, setState] = useState<IChannelListState>({} as any);
    const {selected, filter, view, refreshIndex} = useSelector<IRootState, IChannelState>(state => {
        return state?.channel
    });

    useEffect(() => {
        (async () => {
            const total = await playerCtrl.getUserChannelsTotal(localStorageCtrl.userIdGet, filter, view);
            setState({total});
        })();
    }, [filter, view]);

    const onRenderItem = (item, style, index) => (
            <ChannelItem key={item?.id}
                        index={index + 1}
                        style={style}
                        isSelected={item?.id === selected?.id}
                        item={item}/>
    );

    const loadItems = async (start, stop) => await playerCtrl.getUserChannels(localStorageCtrl.userIdGet, (stop + 1) - start, start, filter, view);

    return (
        <ListVirtual<IChannel> renderer={onRenderItem}
                               className={className}
                               dependencies={[filter, view, refreshIndex]}
                               selected={selected}
                               totalItems={state.total}
                               loadItems={loadItems}/>
    );
};

interface IChannelItemProps {
    item: IChannel;
    isSelected?: boolean;
    style?: Partial<CSSProperties>;
    index: number;
}

const ChannelItemMenu: Array<IMenuItem<IChannel>> = [
    {
        description: (item) => `${item.is_favourite ? "Remove from" : "Add to"} favourites`,
        type: "action",
        onClick: throttle(async (item, ev) => {

            item.is_favourite = !item.is_favourite;

            const i: Partial<IChannel> = {id: item.id, is_favourite: item.is_favourite};
            await HttpController.patch("/channel/favourites", {channels: [i]});
        }, this, 1000)
    },
    {type: "separator"},
    {
        description: (item) => "Delete channel",
        type: "action",
        onClick: async (item) => {
            const res = await showDialog.async({title: "Delete channel", children: (onSubmit, onCancel) => <ConfirmDialog onSubmit={onSubmit} onCancel={onCancel} message={"Are you sure you wan't to delete this channel?"}/>});
            if(!res) return;

            await HttpController.delete(`/channel/${item.id}`);
            store.dispatch(channelSlice.actions.requestUpdate());
    }}
];

const ChannelItem = (props: IChannelItemProps) => {
    const {item, isSelected, style, index} = props;

    const handler = {
        set: (obj, prop, value) => {
            obj[prop] = value;
            setState((prevState) => ({...prevState, entry: {...obj, [prop]: value}}));
            return true;
        }
    };

    const dispatch = useDispatch();
    const [state, setState] = useState({show: false, entry: {...item}});
    const {show, entry} = state;

    const onClick = (ev) => dispatch(channelSlice.actions.select(item));
    const onMouseEnter = () => setState((prevState) => ({...prevState, show: true}));
    const onMouseLeave = () => setState((prevState) => ({...prevState, show: false}));

    const proxy = new Proxy(entry, handler);

    return (
            <div className={cls(css.channel, isSelected && css.selected)}
                 style={style}
                 onMouseEnter={onMouseEnter}
                 onMouseLeave={onMouseLeave}
                 onClick={onClick}>
            <span>{index}  {entry?.description}  {entry?.is_favourite && <img src={Favorite} style={{width: 20, height: 20, marginLeft: "auto"}}/>}</span>
            <ContextMenu<IChannel> items={ChannelItemMenu} eventType={"click"} entry={proxy}>
                {(ref) => (
                    <div ref={ref} className={cls(css.button, show && css.show)}>
                        <img src={MenuIcon} style={{width: 15, height: 15}}/>
                    </div>
                )}
            </ContextMenu>
            </div>
    )
};
