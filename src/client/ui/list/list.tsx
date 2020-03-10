import * as React from "react";
import {ReactNode} from "react";
import {cls} from "../../../utils/function";
import {BusyRender} from "../busy/busy";

import css from "./list.less"

export interface IListProps<T> {
    data: Array<T> | (() => Promise<Array<T>>);
    itemRender: (item: T) => ReactNode;
    onItemClick?: (item: T) => void;
    className?: string;
}

export function List<T>(props: IListProps<T>) {
    const {data, itemRender, onItemClick, className} = props;
    const promise = Array.isArray(data) ? () => Promise.resolve(data) : data;

    return (
        <ul className={cls(css.list, className)}>
            <BusyRender<Array<T>> promise={promise}>
                {(items) => (
                    items.map((i, k) =>
                        <li key={k} onClick={onItemClick ? () => onItemClick(i) : undefined}>{itemRender(i)}</li>
                    )
                )}
            </BusyRender>
        </ul>
    )
}
