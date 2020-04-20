import * as React from "react";
import {CSSProperties, ReactElement, useEffect, useRef, useState} from "react";
import {cls} from "../../../utils/function";
import {Spinner} from "../busy/busy";
import InfiniteLoader from "react-window-infinite-loader";
import {FixedSizeList} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

import css from "./list.less"

interface IListVirtualProps<T> {
    className?: string;
    style?: Partial<CSSProperties>;
    renderer: (item: T, style, index: number) => ReactElement;
    loadItems: (start, stop) => Promise<Array<T>>;
    loadItemsTotal: () => Promise<number>;
    dependencies?: Array<any>;
    selected?: T;
}

interface IListVirtualState<T> {
    items: Array<T>;
    total?: number;
    busy?: boolean;
}

export const ListVirtual = <T extends unknown>(props: IListVirtualProps<T>) => {
    const {className, style, renderer, loadItemsTotal, dependencies} = props;
    const infiniteLoaderRef = useRef(null);
    const [state, setState] = useState<IListVirtualState<T>>({total: 200} as any);

    const {items, total, busy} = state;

    useEffect(() => {
        if (infiniteLoaderRef?.current) {
            infiniteLoaderRef.current.resetloadMoreItemsCache();
        }

        let total;
        (async () => {
            total = await loadItemsTotal();
            await loadItems(0, 200, [], total)
        })();

    }, dependencies || []);

    const onRenderItem = ({ index, style }) => {
        if (!isItemLoaded(index)) {
            return null;
        }

        let item = items[index];

        return renderer(item, style, index);
    };

    const loadItems = async (startIndex, stopIndex, items = state.items, total = state.total) => {
        setState((prevState) => ({...prevState, total, busy: true}));

        const data = await props.loadItems(startIndex, stopIndex) as any;
        const hasData = data?.length;

        let itemsCopy = [...items];
        if (hasData) {

            for (let i = startIndex, j = 0; i <= stopIndex; i++, j++) {
                itemsCopy[i] = data[j];
            }
        }

        setState((prevState) => ({...prevState, items: itemsCopy, busy: false}));
    };

    let timer;
    const requestLoadItems = async (startIndex, stopIndex) => {
        timer && clearTimeout(timer);
        timer = setTimeout(async () => {
            await loadItems(startIndex, stopIndex)
        }, 100)
    };

    const isItemLoaded = index => {
        return !!items[index];
    };

    const hasItems = items && !!items.length;

    return (
        <div className={cls(className)} style={style}>
            {busy && <Spinner/>}
            {!hasItems && <div>No data</div>}
            {hasItems && <AutoSizer>
                {({height, width}) => (
                    <InfiniteLoader
                        ref={infiniteLoaderRef}
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
                                {onRenderItem}
                            </FixedSizeList>
                        )}
                    </InfiniteLoader>
                )}
            </AutoSizer>}
        </div>
    );
};
