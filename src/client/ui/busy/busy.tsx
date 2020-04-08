import * as React from "react";
import css from "./busy.less";
import {ReactNode, useEffect, useState } from "react";
import {Simulate} from "react-dom/test-utils";
import progress = Simulate.progress;

export const Spinner = () => (
    <div className={css.spinner} style={{height: 24, width: 24}}/>
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

interface IBusyPromiseProps {
    promise: () => Promise<void>;
    onResolve: () => void;
}

export const BusyPromise = (props: IBusyPromiseProps) => {
    const {promise, onResolve} = props;
    const [busy , setBusy ] = useState<boolean>(true);

    useEffect(() => {
        if(!promise) return;
        promise().then((data) => {
            onResolve();
            setBusy(false);
        });
    }, [promise]);

    return (
        <div className={css.busyPromise}>
            {busy && <Spinner/>}
            {!busy && <span>Completed</span>}
        </div>
    );
};


export interface IProgressBarPromise{
    description: string,
    promise: () => Promise<any>
}

interface IProgressBarProps {
    promises: Array<IProgressBarPromise>;
    onResolve?: () => void;
}

export const ProgressBar = (props: IProgressBarProps) => {
    const {promises, onResolve} = props;
    const length = promises.length;
    const [state, setState] = useState({progress: 0, description: "Loading"});

    const tick = (i) => {
        const p = i.promise();

        p.then(j => {
           setState((prevState) => ({description: i.description, progress: prevState.progress + 1}))
        });

        return p;
    };

    useEffect(() => {
        (async () => {
            await Promise.all(promises.map(tick));
            onResolve && onResolve()
        })()
    }, [promises]);

    return (
       <div>
           {state.progress}
           {state.description}
       </div>
    )
};
