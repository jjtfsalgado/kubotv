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
    totalItems: number;
    dependencies?: Array<any>;
    updateIndexes?: Array<number>;
}

interface IListVirtualState<T> {
    items: Array<T>;
    busy?: boolean;
}

export const ListVirtual = <T extends unknown>(props: IListVirtualProps<T>) => {
    const {className, style, renderer, totalItems, dependencies} = props;
    const infiniteLoaderRef = useRef(null);

    const [state, setState] = useState<IListVirtualState<T>>({busy: true, items: []});
    const {items, busy} = state;

    useEffect(() => {
        infiniteLoaderRef?.current?.resetloadMoreItemsCache();
        infiniteLoaderRef?.current?._listRef?.scrollTo(0);
        loadItems(0, 200, []);
    }, dependencies || []);

    const onRenderItem = ({ index, style }) => {
        if (!isItemLoaded(index)) {
            return null;
        }

        const item = items[index];
        return renderer(item, style, index);
    };

    const loadItems = async (startIndex, stopIndex, items = state.items) => {
        setState((prevState) => ({...prevState, items, busy: true}));

        const data = await props.loadItems(startIndex, stopIndex) as any;
        const hasData = data?.length;
        const itemsCopy = [...items];

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

    const isItemLoaded = index => items && !!items[index];
    const hasItems = items && !!items.length;

    return (
        <div className={cls(className)} style={style}>
            {busy && <Spinner/>}
            {!hasItems && !busy && <div>No data</div>}
            <AutoSizer>
                {({height, width}) => (
                    <InfiniteLoader
                        ref={infiniteLoaderRef}
                        isItemLoaded={isItemLoaded}
                        itemCount={totalItems}
                        minimumBatchSize={500}
                        loadMoreItems={requestLoadItems}>
                        {({ onItemsRendered, ref }) => (
                               <FixedSizeList style={style}
                                               ref={ref}
                                               width={width}
                                               className={css.list}
                                               height={height}
                                               itemSize={40}
                                               onItemsRendered={onItemsRendered}
                                               itemCount={totalItems}>
                                    {onRenderItem}
                                </FixedSizeList>
                       )}
                    </InfiniteLoader>
                )}
            </AutoSizer>
        </div>
    );
};
