import * as React from "react";
import {CSSProperties, useEffect, useState} from "react";
import {hls, IChannel} from "../../../controllers/hls";
import {List} from "../../../ui/list/list";
import css from "./channel_list.less";
import {cls} from "../../../../utils/function";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "../../../reducers";
import {channelSlice, IChannelState} from "../../../reducers/channel";
import localStorageCtrl from "../../../controllers/localhost";

interface IChannelListProps {
    className?: string;
    style?: Partial<CSSProperties>;
}

export const ChannelList = (props: IChannelListProps) => {
    const {className, style} = props;

    const [state, setState] = useState({busy: true});
    const {data, selected} = useSelector<IRootState, IChannelState>(state => {
        return state?.channel
    });

    useEffect(() => {
        (async () => {
            await hls.getUserChannels(localStorageCtrl.userIdGet);
            setState({busy: false})
        })();
    }, []);

    const itemRender = (item: IChannel) => (
        <ChannelItem key={item.id}
                     isSelected={item.id === selected?.id}
                     item={item}/>
    );

    return (
        <List className={cls(css.list, className)}
              title={"Channels"}
              emptyView={<span>No channels</span>}
              style={style}
              busy={state?.busy}
              data={data}
              itemRender={itemRender}/>
    );
};

interface IChannelItemProps {
    item: IChannel;
    isSelected?: boolean;
}

const ChannelItem = (props: IChannelItemProps) => {
    const {item, isSelected} = props;
    const dispatch = useDispatch();

    const onClick = () => {
        dispatch(channelSlice.actions.select(item));
    };

    return (
        <div className={cls(css.channel, isSelected && css.selected)}
             onClick={onClick}>
            <span>{item && item.description}</span>
        </div>
    )
};

