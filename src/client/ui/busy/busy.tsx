import * as React from "react";
import {ReactNode, useEffect, useState} from "react";
import css from "./busy.less";
import {CheckSvg} from "../../assets/icons/check";

export const Spinner = () => (
    <div className={css.spinner} style={{height: 24, width: 24}}/>
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

    if(state.loading) return <Spinner/>;

    return (
        <>
            {children(state.data)}
        </>
    );
};


interface IBusyImportProps {
    load?: () => Promise<any>; //has to be a default export
    children: (args: any) => ReactNode;
}

interface IBusyImportState {
    component?: ReactNode;
    busy: boolean
}

export const BusyImport = (props: IBusyImportProps) => {
    const [state, setState] = useState<IBusyImportState>({busy: true});
    const {component} = state;

    useEffect(() => {
        (async () => {
            const c = await props.load();
            setState({component: c.default ? c.default : c, busy: false});
        })();
    }, []);

    return (
        <>
            {state.busy ? <Spinner/> : props.children(component)}
        </>
    )
};


// interface IBusyPromiseProps {
//     promise: () => Promise<void>;
//     onResolve: () => void;
// }
//
// export const BusyPromise = (props: IBusyPromiseProps) => {
//     const {promise, onResolve} = props;
//     const [busy , setBusy ] = useState<boolean>(true);
//
//     useEffect(() => {
//         if(!promise) return;
//         promise().then((data) => {
//             onResolve();
//             setBusy(false);
//         });
//     }, [promise]);
//
//     return (
//         <div className={css.busyPromise}>
//             {busy && <Spinner/>}
//             {!busy && <span>Completed</span>}
//         </div>
//     );
// };


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
            {!isComplete && (
                <div className={css.container}>
                    <span>{state.description}</span>
                    <div className={css.barContainer}>
                        <div className={css.bar} style={{width: `${(progress/length) * 100}%` }}/>
                    </div>
                </div>
            )}
            {isComplete && <CheckSvg size={32} color={"#0056FB"}/>}
        </div>
    )
};
