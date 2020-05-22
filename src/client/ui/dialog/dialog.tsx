import * as React from "react";
import {ReactNode, useEffect} from "react";
import * as ReactDOM from "react-dom";
import {createPortal} from "react-dom";
import {cls} from "../../../utils/function";
import css from "./dialog.less";
import {_MODAL_ROOT_} from "../../../../global";
import {CrossSvg} from "../../assets/icons/cross";
import {Button} from "../button/button";

export interface IShowDialog<T> {
    title?: string;
    isModeless?: boolean;
    children: (onSubmit: (value: T) => void, onCancel: () => void) => ReactNode;
}

export const getModalRoot = () => document.getElementById(_MODAL_ROOT_);

export namespace showDialog {
    export const async = async <T extends unknown>({children, title, isModeless}: IShowDialog<T>): Promise<T | false> => {
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
                <DialogPortal title={title} onClose={onCancel} modal={isModeless}>
                    {children(onSubmit, onCancel)}
                </DialogPortal>
                , div);
        });
    };

    export const sync = <T extends unknown>({children, title}: {title: string, children: ReactNode}) => {
        const div = document.createElement("div");
        const onCancel = () => {
            ReactDOM.unmountComponentAtNode(div);
        };

        ReactDOM.render(
            <DialogPortal title={title} onClose={onCancel} modal={true}>
                {children}
            </DialogPortal>
            , div);
    };
}

interface IDialogContainerProps {
    modal?: boolean; //default true
    children: ReactNode;
}

export const DialogContainer = (props: IDialogContainerProps) => {
    const {children, modal} = props;

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "initial";
        }
    }, []);

    return (
        <div className={cls(css.container, !modal && css.modeless)}>
            {children}
        </div>
    )
};

DialogContainer.defaultProps = {
    modal: true
};

interface IDialog<T>{
    title: string;
    children: ReactNode;
    onClose?: () => void;
    modal?: boolean;
}

export function Dialog<T>(props: IDialog<T>) {
    const {title, children, onClose} = props;

    return (
        <div className={cls(css.dialog)}>
            <div className={css.title}>
                <span>{title}</span>
                {onClose && (
                    <Button onClick={onClose}
                            className={css.close}
                            type={"transparent"}>
                        <CrossSvg/>
                    </Button>
                )}
            </div>
            <div className={css.content}>
                {children}
            </div>
        </div>
    );
}

export function DialogPortal<T>(props: IDialog<T>) {
    const {modal} = props;

    return (
        createPortal(
            <DialogContainer modal={modal}>
                <Dialog {...props}/>
            </DialogContainer>,
            getModalRoot()
        )
    )
}


