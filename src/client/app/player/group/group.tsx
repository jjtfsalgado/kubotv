import * as React from "react";
import {List} from "../../../ui/list/list";
import {cls} from "../../../../utils/function";
import css from "./group.less";
import {Link} from "react-router-dom";
import {useDispatch} from "react-redux";
import {channelSlice} from "../../../reducers/channel";

export interface IGroup{
    icon?: string;
    description: string;
    onClick: () => void;
}

interface IGroupBar {
    className?: string;
    data: Array<IGroup>
}

export const GroupBar = (props: IGroupBar) => {
    const {data, className} = props;

    const dispatch = useDispatch();

    const onGroupRender = (item) => {
        return (
            <div className={css.group} onClick={item.onClick}>
                <div className={css.circle}>
                    {item.description}
                </div>
            </div>
        )
    };

    const onToggleSidePanel = () => dispatch(channelSlice.actions.toggle());

    return (
        <div className={cls(className)}>
            <Link to={"/player"}>Logo</Link>
            <button onClick={onToggleSidePanel}>
                Toggle
            </button>
            <List data={data}
                  itemRender={onGroupRender}/>
        </div>
    )
};
