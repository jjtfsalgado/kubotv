import {_MODAL_ROOT_} from "../../../../global";
import * as ReactDOM from "react-dom";

import css from "./toast.less";
import {cls} from "../../../utils/function";
import * as React from "react";

export function showToast(props: IToastProps) {
    ReactDOM.render(<Toast {...props}/>, document.getElementById(_MODAL_ROOT_));
}

enum IToast {
    "info" = "Info",
    "error" = "Error",
    "success" = "Success"
}

interface IToastProps {
    type: "info" | "error" | "success";
    message: string;
    title?: string;
}

const Toast = (props: IToastProps) => {
    const {title, type, message} = props;

    return (
        <div className={css.container}>
            <div className={cls(css.toast)}>
                <div className={css.title}>
                    {title || IToast[type]}
                </div>
                <div className={css.content}>
                    {message}
                </div>
            </div>
        </div>
    );
};
