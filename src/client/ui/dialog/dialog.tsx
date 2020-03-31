import * as React from "react";
import {ReactNode} from "react";
import * as ReactDOM from "react-dom";
import {createPortal} from "react-dom";
import {cls} from "../../../utils/function";
import css from "./dialog.less";
import {_MODAL_ROOT_} from "../../../../global";

function unMountDialog() {
    ReactDOM.unmountComponentAtNode(document.getElementById(_MODAL_ROOT_));
}

export interface IShowDialog<T> {
    title?: string;
    children: (onSubmit: (value: T) => void, onCancel: () => void) => ReactNode;
}

export function showDialog<T>({children, title}: IShowDialog<T>): Promise<T | false> {
    return new Promise((res) => {
        const onSubmit = (value?: T) => {
            res(value);
            unMountDialog()
        };
        const onCancel = () => {
            res(false);
            unMountDialog()
        };

        ReactDOM.render(
            <Dialog title={title}>
                {children(onSubmit, onCancel)}
            </Dialog>
        , document.getElementById(_MODAL_ROOT_));
    });
}

interface IDialog<T>{
    isModal?: boolean;
    title: string;
    children: ReactNode;
}

export function Dialog<T>(props: IDialog<T>) {
    const {title, isModal, children} = props;

    return (
        createPortal(
            <div className={css.container}>
                <div className={cls(css.dialog, isModal && css.modal)}>
                    <div className={css.title}>
                        {title}
                    </div>
                    <div className={css.content}>
                        {children}
                    </div>
                </div>
            </div>,
            document.getElementById(_MODAL_ROOT_)
        )
    )
}


