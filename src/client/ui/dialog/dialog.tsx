import * as React from "react";
import {ReactNode} from "react";
import * as ReactDOM from "react-dom";
import {createPortal} from "react-dom";
import {cls} from "../../../utils/function";
import css from "./dialog.less";
import {_MODAL_ROOT_} from "../../../../global";

export interface IShowDialog<T> {
    title?: string;
    children: (onSubmit: (value: T) => void, onCancel: () => void) => ReactNode;
}

export const getModalRoot = () => document.getElementById(_MODAL_ROOT_);

export namespace showDialog {
    export const async = async <T extends unknown>({children, title}: IShowDialog<T>): Promise<T | false> => {
        return new Promise((res) => {
            const div = document.createElement("div");

            const onSubmit = (value?: T) => {
                res(value);
                ReactDOM.unmountComponentAtNode(div);
            };

            const onCancel = () => {
                res(false);
                ReactDOM.unmountComponentAtNode(div);
            };

            ReactDOM.render(
                <Dialog title={title} onClose={onCancel}>
                    {children(onSubmit, onCancel)}
                </Dialog>
                , div);
        });
    };

    export const sync = <T extends unknown>({children, title}: {title: string, children: ReactNode}) => {
        const div = document.createElement("div");
        const onCancel = () => {
            ReactDOM.unmountComponentAtNode(div);
        };

        ReactDOM.render(
            <Dialog title={title} onClose={onCancel} isModeless={true}>
                {children}
            </Dialog>
            , div);
    };
}

interface IDialogContainerProps {
    isModeless?: boolean; //no modal
    children: ReactNode;
}

export const DialogContainer = (props: IDialogContainerProps) => {
    const {children, isModeless} = props;

    return (
        <div className={cls(css.container, isModeless && css.modeless)}>
            {children}
        </div>
    )
};

interface IDialog<T>{
    title: string;
    children: ReactNode;
    onClose?: () => void;
    isModeless?: boolean;
}

export function Dialog<T>(props: IDialog<T>) {
    const {title, children, isModeless, onClose} = props;

    return (
        createPortal(
            <DialogContainer isModeless={isModeless}>
                <div className={cls(css.dialog)}>
                    <div className={css.title}>
                        {title}
                        {onClose && <button onClick={onClose}>Close</button>}
                    </div>
                    <div className={css.content}>
                        {children}
                    </div>
                </div>
            </DialogContainer>,
            getModalRoot()
        )
    )
}


