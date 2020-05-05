import * as React from "react";
import {cls} from "../../../../utils/function";
import css from "./group.less";
import {ReactNode} from "react";

export interface IGroup{
    id: string;
    icon?: ReactNode;
    description: string;
    onClick: () => void;
    position?: "end";
}

interface IGroupBar {
    className?: string;
    data: Array<IGroup>;
    selected?: string;
}

export const GroupBar = (props: IGroupBar) => {
    const {data, className, selected} = props;

    const onGroupRender = (item, ix) => {
        return (
            <div key={ix} className={cls(css.group, item.position === "end" && css.end, selected === item.id && css.selected)} onClick={item.onClick}>
                {item.icon}
            </div>
        )
    };

    return (
        <div className={cls(css.groups, className)}>
            {data.map(onGroupRender)}
        </div>
    )
};
