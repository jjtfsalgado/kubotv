import * as React from "react";
import css from "./busy.less";
import {ReactNode, useEffect, useState } from "react";

export const Spinner = () => (
    <div className={css.spinner}/>
);

export const BusyOverlay = () => (
    <div className={css.busyOverlay}>
        <Spinner/>
    </div>
);

export const BusyRender = <T extends unknown>(props: {promise: () => Promise<T>, children: (data: T) => ReactNode}) => {
    const {promise, children} = props;
    const [state, setState] = useState<{loading: boolean, data: T}>({loading: true, data: null});

    useEffect(() => {
        if(!promise) return;
        promise().then((data) => {
            setState({
                loading: false,
                data
            })
        });
    }, [promise]);

    if(state.loading) return <BusyOverlay/>;

    return (
        <>
            {children(state.data)}
        </>
    );
};
