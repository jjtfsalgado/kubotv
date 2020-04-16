import * as React from "react";
import {CSSProperties, useEffect, useState} from "react";
import {hls, IChannel} from "../../../controllers/hls";
import css from "./channel_list.less";
import {cls} from "../../../../utils/function";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "../../../reducers";
import {channelSlice, IChannelState} from "../../../reducers/channel";
import localStorageCtrl from "../../../controllers/localhost";
import InfiniteLoader from "react-window-infinite-loader";
import {FixedSizeList} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import {Spinner} from "../../../ui/busy/busy";

interface IChannelListProps {
    className?: string;
    style?: Partial<CSSProperties>;
}

interface IChannelListState {
    items: Array<IChannel>;
    total?: number;
    busy?: boolean;
    isNextPageLoading?: boolean;
}

export const ChannelList = (props: IChannelListProps) => {
    const {className, style} = props;

    const [state, setState] = useState<IChannelListState>({items: [], busy: true});
    const {selected} = useSelector<IRootState, IChannelState>(state => {
        return state?.channel
    });

    const {items, total, busy} = state;
    
    useEffect(() => {
        (async () => {
            const total = await hls.getUserChannelsTotal(localStorageCtrl.userIdGet);
            setState({...state, total, busy: false});
        })();
    }, []);

    const Item = ({ index, style }) => {
        if (!isItemLoaded(index)) {
            return <span style={style}/>
        }

        let item = items[index];
        return <ChannelItem key={item?.id}
                            style={style}
                            isSelected={item?.id === selected?.id}
                            item={item}/>;
    };

    const loadItems = async (startIndex, stopIndex) => {
        setState((prevState) => ({...prevState, busy: true}));

        const data = await hls.getUserChannels(localStorageCtrl.userIdGet, (stopIndex + 1) - startIndex, startIndex);
        const itemsCopy = [...state.items];

        for (let i = startIndex, j = 0; i <= stopIndex; i++, j++) {
            itemsCopy[i] = data[j];
        }

        setState((prevState) => ({...prevState, items: itemsCopy, busy: false}));
    };

    let timer;
    const requestLoadItems = async (startIndex, stopIndex) => {
        clearTimeout(timer);
        timer = setTimeout(async () => {
            await loadItems(startIndex, stopIndex)
        }, 100)
    };

    const isItemLoaded = index => {
        return !!items[index];
    };

    return (
        <div className={cls(className)} style={style}>
            <div className={css.title}>Channels</div>
            <div className={css.channels}>
                {busy && <Spinner/>}
                <AutoSizer>
                    {({height, width}) => (
                        <InfiniteLoader
                            isItemLoaded={isItemLoaded}
                            itemCount={total}
                            minimumBatchSize={500}
                            loadMoreItems={requestLoadItems}>
                            {({ onItemsRendered, ref }) => (
                                <FixedSizeList style={style}
                                               width={width}
                                               className={css.list}
                                               ref={ref}
                                               height={height}
                                               itemSize={40}
                                               onItemsRendered={onItemsRendered}
                                               itemCount={total}>
                                    {Item}
                                </FixedSizeList>
                            )}
                        </InfiniteLoader>
                    )}
                </AutoSizer>
            </div>
        </div>
    );
};

interface IChannelItemProps {
    item: IChannel;
    isSelected?: boolean;
    style?: Partial<CSSProperties>
}

const ChannelItem = (props: IChannelItemProps) => {
    const {item, isSelected, style} = props;
    const dispatch = useDispatch();

    const onClick = () => {
        dispatch(channelSlice.actions.select(item));
    };

    return (
        <div className={cls(css.channel, isSelected && css.selected)}
             style={style}
             onClick={onClick}>
            <span>{item && item.description}</span>
        </div>
    )
};

