import * as React from "react";
import css from "./button.less";
import {ReactNode} from "react";
import {cls} from "../../../utils/function";

interface IButtonProps {
    onClick: (ev) => void;
    children: ReactNode;
    disabled?: boolean;
    className?: string;
    type?: "transparent" | "selected" | "negative" | "secondary" | any
}

export const Button = (props: IButtonProps) => {
    const {onClick, children, type, className, disabled} = props;

    return (
        <button onClick={disabled ? null : onClick}
                className={cls(css.button,
                    disabled && css.disabled,
                    type === "transparent" && css.transparent,
                    type === "primary" && css.primary,
                    type === "secondary" && css.secondary,
                    type === "selected" && css.selected,
                    type === "negative" && css.negative, className)}>
            {children}
        </button>
    );
};
