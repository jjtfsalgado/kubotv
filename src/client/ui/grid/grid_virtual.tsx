import * as React from "react";
import {CSSProperties, ReactElement, useEffect, useState} from "react";
import {cls} from "../../../utils/function";
import {Spinner} from "../busy/busy";
import {FixedSizeGrid} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

import css from "./list.less"
import {TvOff} from "../../assets/icons/tv_off";

interface IGridVirtualProps<T> {
    className?: string;
    style?: Partial<CSSProperties>;
    renderer: (item: T, style, index: number) => ReactElement;
    loadItems: () => Promise<Array<T>>;
    dependencies?: Array<any>;
}

interface IListVirtualState<T> {
    busy?: boolean;
    total?: number;
    data?: Array<any>
}

export const GridVirtual = <T extends unknown>(props: IGridVirtualProps<T>) => {
    const {className, style, renderer, dependencies} = props;

    const [state, setState] = useState<IListVirtualState<T>>({busy: true});
    const {busy, total, data} = state;

    useEffect(() => {
        (async () => {
            setState((prevState) => ({...prevState, busy: true}));
            const data = await props.loadItems();

            setState((prevState) => ({...prevState, data, busy: false, total: data && data.length}));
        })();

    }, dependencies);


    const isLoading = busy;

    const rowCount = Math.ceil(total / 3);
    const columnCount = 3;

    const Cell = ({ columnIndex, rowIndex, style }) => {
        const index = rowIndex * columnCount + columnIndex;
        const item = data[index];

        if(!item) return null;

        return renderer(item, style, index);
    };

    return (
        <div className={cls(className)} style={style}>
            {isLoading && <Spinner/>}
            {!isLoading && total === 0 && (
                <div className={css.nodata}>
                    <div className={css.content}><TvOff color={"#0056FB"}/> <span>Oops, couldn't find any</span></div>
                </div>
            )}
            <AutoSizer>
                {({height, width}) => (
                    <FixedSizeGrid
                        width={width}
                        height={height}
                        className={css.list}
                        columnCount={columnCount}
                        columnWidth={Math.ceil(width/columnCount)}
                        rowCount={rowCount}
                        rowHeight={100}>
                        {Cell}
                    </FixedSizeGrid>
                )}
            </AutoSizer>
        </div>
    );
};
