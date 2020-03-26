import * as React from "react";
import {ReactNode} from "react";
import {cls} from "../../../utils/function";
import {BusyRender} from "../busy/busy";

import css from "./list.less"

export interface IListProps<T> {
    data: Array<T> | (() => Promise<Array<T>>);
    title?: string;
    itemRender: (item: T) => ReactNode;
    onItemClick?: (item: T) => void;
    className?: string;
}

export function List<T>(props: IListProps<T>) {
    const {data, itemRender, onItemClick, className, title} = props;
    const promise = Array.isArray(data) ? () => Promise.resolve(data) : data;

    return (
        <div className={cls(css.list, className)}>
            {title && (
                <span className={css.title}>
                    {title}
                </span>
            )}
            <BusyRender<Array<T>> promise={promise}>
                {(items) => (
                    items.map((i, k) =>
                        <div key={k}
                             className={css.item}
                             onClick={onItemClick ? () => onItemClick(i) : undefined}>
                            {itemRender(i)}
                        </div>
                    )
                )}
            </BusyRender>
        </div>
    )
}
