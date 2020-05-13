import * as ReactDOM from "react-dom";
import {createPortal} from "react-dom";
import {DialogContainer, getModalRoot} from "../dialog/dialog";
import * as React from "react";
import {ReactNode, useEffect} from "react";
import css from "./notification.less";
import {cls} from "../../../utils/function";
import {IProgressBarPromise, ProgressBar} from "../busy/busy";

export interface IShowNotification<T>{
    title: string;
    children: ReactNode;
    promises?: Array<IProgressBarPromise>;
}

const getNotificationContainer = () => document.getElementById(_NOTIFICATIONS_);

let divContainer;
export function showNotification<T>({children, title, promises}: IShowNotification<T>): void {
    const div = document.createElement("div");

    //if no container, render it first
    if(!divContainer){
        divContainer = document.createElement("div");
        ReactDOM.render(
            <NotificationsContainer/>
        , divContainer);
    }

    const onCancel = () => {
        const containerDOM = getNotificationContainer();

        //when last notification, unmount container too
        if(containerDOM?.childNodes.length <= 1){
            ReactDOM.unmountComponentAtNode(divContainer);
            divContainer = null;
            return;
        }

        ReactDOM.unmountComponentAtNode(div);
    };

    ReactDOM.render(
        <Notification title={title} onClose={onCancel} promises={promises}>
            {children}
        </Notification>
    , div);
}

interface INotification<T> extends IShowNotification<T>{
    onClose: () => void;
}

const _NOTIFICATIONS_ = "notifications";

const NotificationsContainer = () => {
    return (
        createPortal(
            <DialogContainer modal={false}>
                <div id={_NOTIFICATIONS_} className={css.notifications}/>
            </DialogContainer>,
            getModalRoot()
        )
    )
};

export const Notification= <T extends unknown>(props: INotification<T>) => {
    const {title, children, onClose, promises} = props;

    useEffect(() => {
        //if there's promises to be resolved dont trigger the timeout immediately
        !promises && onCloseTimeout()
    }, []);

    const onCloseTimeout = () => setTimeout(onClose, 5000);

    return (
        createPortal(
            <div className={cls(css.notification)}>
                <div className={css.title}>
                    {title}
                    <button onClick={onClose}>Close</button>
                </div>
                <div className={css.content}>
                    {children}
                    {promises && <ProgressBar promises={promises} onResolve={onCloseTimeout}/>}
                </div>
            </div>,
            getNotificationContainer()
        )
    )
};
