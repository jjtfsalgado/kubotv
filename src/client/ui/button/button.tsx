import * as React from "react";
import css from "./button.less";
import {ReactNode} from "react";
import {cls} from "../../../utils/function";

interface IButtonProps {
    onClick?: (ev) => void;
    children?: ReactNode;
    disabled?: boolean;
    text?:string;
    className?: string;
    type?: "transparent" | "selected" | "negative" | "secondary" | any
}

export const Button = (props: IButtonProps) => {
    const {onClick, children, type, className, disabled, text} = props;

    return (
        <button onClick={(disabled || !onClick) ? null : onClick}
                className={cls(css.button,
                    disabled && css.disabled,
                    type === "transparent" && css.transparent,
                    type === "primary" && css.primary,
                    type === "secondary" && css.secondary,
                    type === "selected" && css.selected,
                    type === "negative" && css.negative, className)}>
            {text && <span className={css.text}>{text}</span>}
            {children}
        </button>
    );
};
