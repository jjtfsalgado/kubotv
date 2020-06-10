import * as React from "react";
import {CSSProperties, useCallback, useEffect, useState} from "react";
import {IChannel, playerCtrl} from "../../../../controllers/playerCtrl";
import css from "./channel_list.less";
import {cls, throttle} from "../../../../../utils/function";
import {useDispatch, useSelector} from "react-redux";
import {IRootState, store} from "../../../../reducers";
import {channelSlice, IChannelView} from "../../../../reducers/channel";
import localStorageCtrl from "../../../../controllers/localhost";
import {ListVirtual} from "../../../../ui/list/list_virtual";
import {ContextMenu, IMenuItem} from "../../../../ui/menu/menu";
import {showDialog} from "../../../../ui/dialog/dialog";
import {ConfirmDialog} from "../../../../ui/dialog/variants/confirm";
import {MenuSvg} from "../../../../assets/icons/menu";
import {FavoriteSvg} from "../../../../assets/icons/favorite";
import {Breadcrumb, ILevel} from "../../../../ui/breadcrumb/breadcrumb";

interface IChannelListProps {
    className?: string;
    playlistId: string;
    group?: string | "All";
    levels?: Array<ILevel>;
}

export const ChannelList = (props: IChannelListProps) => {
    const {className, playlistId, group, levels} = props;

    const filter = useSelector<IRootState, string>(state => state?.channel?.filter);
    const view = useSelector<IRootState, IChannelView>(state => state?.channel?.view);
    const refreshIndex = useSelector<IRootState, number>(state => state?.channel?.refreshIndex);

    const onRenderItem = useCallback((item, style, index) => (
        <ChannelItem key={item?.id}
                    index={index + 1}
                    style={style}
                    item={item}/>
    ), []);

    const loadItems = useCallback(async (start, stop) => {
        return await playerCtrl.getUserChannels(localStorageCtrl.userIdGet, playlistId, (stop + 1) - start, start, filter, group === "All" ? null : group);
    }, [filter, view, group ]);

    const loadTotal = useCallback(async () => {
        return await playerCtrl.getUserChannelsTotal(localStorageCtrl.userIdGet, playlistId, filter, group === "All" ? null : group)
    }, [filter, view, group]);

    const dependencies = [refreshIndex, loadItems, view];

    return (
        <>
            <Breadcrumb levels={levels}/>
            <ListVirtual<IChannel> renderer={onRenderItem}
                                   className={className}
                                   dependencies={dependencies}
                                   loadTotal={loadTotal}
                                   loadItems={loadItems}/>
        </>
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
            ev.stopPropagation();
            item.is_favourite = !item.is_favourite;

            const i: Partial<IChannel> = {id: item.id, is_favourite: item.is_favourite};
            await playerCtrl.updateFavourite(i);

        }, this, 500)
    },
    {type: "separator"},
    {
        description: (item) => "Delete channel",
        type: "action",
        onClick: async (item, ev) => {
            ev.stopPropagation();

            const res = await showDialog.async({title: "Delete channel", children: (onSubmit, onCancel) => <ConfirmDialog onSubmit={onSubmit} onCancel={onCancel} message={"Are you sure you want to delete this channel?"}/>});
            if(!res) return;

            await playerCtrl.deleteChannel(item);
            store.dispatch(channelSlice.actions.requestUpdate());
    }}
    // {
    //     description: (item) => {
    //         const view = store?.getState()?.channel?.view;
    //         return view === "all" ? "Delete all" : `Delete all ${view}`;
    //     },
    //     type: "action",
    //     onClick: async (item, ev) => {
    //         ev.stopPropagation();
    //         const view = store?.getState()?.channel?.view;
    //
    //         const res = await showDialog.async({title: view === "all" ? "Delete all" : `Delete all ${view}`, children: (onSubmit, onCancel) => <ConfirmDialog onSubmit={onSubmit} onCancel={onCancel} message={"Are you sure you want to proceed?"}/>});
    //         if(!res) return;
    //
    //         await HttpController.delete(`/channel/view/${view}&${localStorageCtrl.userIdGet}`);
    //         store.dispatch(channelSlice.actions.requestUpdate());
    // }}
];


interface IChannelItemState {
    proxy?: IChannel;
    entry: IChannel;
    show: boolean;
}

export const ChannelItem = (props: IChannelItemProps) => {
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
                <div className={css.content}> <ChannelLogo item={item} className={css.logo}/> <span className={css.description}>{entry?.description}</span>  {entry?.is_favourite && <FavoriteSvg size={16} style={{marginLeft: "auto"}} color={"#b3b3b3"}/>}</div>
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

const ChannelLogo = (props: {item: IChannel, className?: string}) => {
    const {item, className} = props;

    return (
        <span className={cls(css.logo, className)}>
            {item.logo_url ? <img alt={"logo"} src={item.logo_url}/> : <Initials description={item.description}/>}
        </span>
    )
}

export const Initials = ({description, className} : {description: string, className?: string}) => {
    if(!description) return null;

    const init1 = description[0].toUpperCase();
    const init2 = description[description.length - 1].toUpperCase();

    return <div className={cls(css.initials, className)}>
        <span>{init1}{init2}</span>
    </div>
};

