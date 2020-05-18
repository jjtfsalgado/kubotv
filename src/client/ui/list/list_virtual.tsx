import * as React from "react";
import {CSSProperties, ReactElement, ReactNode, useEffect, useLayoutEffect, useRef, useState} from "react";
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
    busy?: boolean;
}

const itemsCache = (() => {
    let data;

    return ({
        get data() {
            return data;
        },
        get init(){
            if(!data){
                data = [];
            }

            return data;
        },
        reset(){
          return data = null;
        }
    })
})();

export const ListVirtual = <T extends unknown>(props: IListVirtualProps<T>) => {
    const {className, style, renderer, totalItems, dependencies} = props;
    const infiniteLoaderRef = useRef(null);

    const [state, setState] = useState<IListVirtualState<T>>({busy: true});
    const {busy} = state;

    useEffect(() => {

        if(infiniteLoaderRef?.current){
            itemsCache.reset();
            infiniteLoaderRef?.current?.resetloadMoreItemsCache(true);
        }

        return () => {
            itemsCache.reset();
        }
    }, dependencies);

    const onRenderItem = ({ index, style }) => {
        if (!isItemLoaded(index)) {
            return null;
        }

        const item = itemsCache.data[index];
        return renderer(item, style, index);
    };

    const loadItems = async (startIndex, stopIndex) => {
        setState((prevState) => ({...prevState, busy: true}));
        const items = itemsCache.init;
        const data = await props.loadItems(startIndex, stopIndex) as any;
        const hasData = data?.length;

        if (hasData) {
            for (let i = startIndex, j = 0; i <= stopIndex; i++, j++) {
                items[i] = data[j];
            }
        }

        setState((prevState) => ({...prevState, busy: false}));
    };

    let timer;
    const requestLoadItems = async (startIndex, stopIndex) => {
        timer && clearTimeout(timer);
        timer = setTimeout(async () => {
            await loadItems(startIndex, stopIndex);
        }, 100)
    };

    const isItemLoaded = index => itemsCache.data && !!itemsCache.data[index];
    const isLoading = !itemsCache.data || busy;

    return (
        <div className={cls(className)} style={style}>
            {isLoading && <Spinner/>}
            {!isLoading && !itemsCache.data?.length && <div>No data</div>}
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
