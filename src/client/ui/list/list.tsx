import * as React from "react";
import {CSSProperties, ReactNode} from "react";
import {cls} from "../../../utils/function";
import {BusyRender, Spinner} from "../busy/busy";

import css from "./list.less"

export interface IListProps<T> {
    data: Array<T> | (() => Promise<Array<T>>);
    title?: string;
    emptyView?: ReactNode;
    busy?: boolean;
    itemRender: (item: T) => ReactNode;
    onItemClick?: (item: T, ev) => void;
    className?: string;
    style?: Partial<CSSProperties>;
}

export function List<T>(props: IListProps<T>) {
    const {data, itemRender, onItemClick, className, title, style, busy, emptyView} = props;
    const promise = Array.isArray(data) ? () => Promise.resolve(data) : data;

    return (
        <div className={cls(css.list, className)} style={style}>
            {title && (
                <span className={css.title}>
                    {title}
                </span>
            )}
            {busy && <Spinner/>}
            {!busy && !data?.length && emptyView}
            <BusyRender<Array<T>> promise={promise}>
                {(items) => (
                    items.map((i, k) =>
                        <div key={k}
                             className={css.item}
                             onClick={onItemClick ? (ev) => onItemClick(i, ev) : undefined}>
                            {itemRender(i)}
                        </div>
                    )
                )}
            </BusyRender>
        </div>
    )
}
