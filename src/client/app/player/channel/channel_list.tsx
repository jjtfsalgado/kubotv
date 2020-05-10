import * as React from "react";
import {CSSProperties, useCallback, useEffect, useState} from "react";
import {IChannel, playerCtrl} from "../../../controllers/playerCtrl";
import css from "./channel_list.less";
import {cls, throttle} from "../../../../utils/function";
import {useDispatch, useSelector} from "react-redux";
import {IRootState, store} from "../../../reducers";
import {channelSlice, IChannelState, IChannelView} from "../../../reducers/channel";
import localStorageCtrl from "../../../controllers/localhost";
import {ListVirtual} from "../../../ui/list/list_virtual";
import {ContextMenu, IMenuItem} from "../../../ui/menu/menu";
import HttpController from "../../../controllers/http";
import {showDialog} from "../../../ui/dialog/dialog";
import {ConfirmDialog} from "../../../ui/dialog/variants/confirm";
import {MenuSvg} from "../../../assets/icons/menu";
import {FavoriteSvg} from "../../../assets/icons/favorite";

interface IChannelListProps {
    className?: string;
}

interface IChannelListState {
    total: number;
}

export const ChannelList = (props: IChannelListProps) => {
    const {className} = props;
    const [state, setState] = useState<IChannelListState>({} as any);

    const filter = useSelector<IRootState, string>(state => state?.channel?.filter);
    const view = useSelector<IRootState, IChannelView>(state => state?.channel?.view);
    const refreshIndex = useSelector<IRootState, number>(state => state?.channel?.refreshIndex);

    const dependencies = [filter, view, refreshIndex];

    useEffect(() => {
        (async () => {
            const total = await playerCtrl.getUserChannelsTotal(localStorageCtrl.userIdGet, filter, view);
            setState({total});
        })();
    }, dependencies);

    const onRenderItem = (item, style, index) => (
            <ChannelItem key={item?.id}
                        index={index + 1}
                        style={style}
                        item={item}/>
    );

    const loadItems = async (start, stop) => await playerCtrl.getUserChannels(localStorageCtrl.userIdGet, (stop + 1) - start, start, filter, view);

    return (
        <ListVirtual<IChannel> renderer={onRenderItem}
                               className={className}
                               dependencies={dependencies}
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
        }, this, 500)
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


interface IChannelItemState {
    proxy?: IChannel;
    entry: IChannel;
    show: boolean;
}

const ChannelItem = (props: IChannelItemProps) => {
    const {item, style, index} = props;
    const selected = useSelector<IRootState, IChannel>(state => state?.channel?.selected);
    const dispatch = useDispatch();
    const [state, setState] = useState<IChannelItemState>({show: false, entry: item});
    const {show, entry, proxy} = state;
    const isSelected = selected?.id === item?.id;

    useEffect(() => {
        const proxy = new Proxy(item,{
            set: (obj, prop, value) => {
                obj[prop] = value;
                setState((prevState) => ({...prevState, entry: {...obj, [prop]: value}}));
                return true;
            }
        });

        setState((prevState) => ({...prevState, proxy}));
    }, []);


    const onClick = (ev) => dispatch(channelSlice.actions.select({...item}));
    const onMouseEnter = () => setState((prevState) => ({...prevState, show: true}));
    const onMouseLeave = () => setState((prevState) => ({...prevState, show: false}));

    return (
            <div className={cls(css.channel, isSelected && css.selected)}
                 style={style}
                 onMouseEnter={onMouseEnter}
                 onMouseLeave={onMouseLeave}
                 onClick={onClick}>
                <div className={css.content}>{index}  <span>{entry?.description}</span>  {entry?.is_favourite && <FavoriteSvg size={16} style={{marginLeft: "auto"}} color={"#b3b3b3"}/>}</div>
                <ContextMenu<IChannel> items={ChannelItemMenu} eventType={"click"} entry={proxy}>
                    {(ref) => (
                        <div ref={ref} className={cls(css.button, show && css.show)}>
                            <MenuSvg color={"#b3b3b3"} size={16}/>
                        </div>
                    )}
                </ContextMenu>
            </div>
    )
};