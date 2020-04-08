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

interface IProgressBarState {
    progress: number;
    description: string;
    isComplete?: boolean;
}

export const ProgressBar = (props: IProgressBarProps) => {
    const {promises, onResolve} = props;
    const length = promises.length;
    const [state, setState] = useState<IProgressBarState>({progress: 0, description: "Loading", isComplete: false});
    const {progress, isComplete} = state;

    const setProgress = (promise) => {
        setState(prevState => ({description: promise.description, progress: prevState.progress + 1}))
    };

    useEffect(() => {
        (async () => {
            try{
                for (let i = 0; i < length; i++) {
                    const p = promises[i];
                    await p.promise().then(() => setProgress(p));
                }

                setState({...state, isComplete: true});
            } finally {
                onResolve && onResolve()
            }
        })()
    }, [promises]);

    return (
       <div className={css.progress}>
           <span>{state.description}</span>
           {!isComplete && <div className={css.bar} style={{width: `${(progress/length) * 100}%` }}/>}
           {isComplete && <span>Complete</span>}
       </div>
    )
};
