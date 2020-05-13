import css from "./base.less";
import * as React from "react";
import {cls} from "../../../utils/function";

export interface IBaseFieldProps {
    placeholder?: string;
    onChange: (ev) => void;
    name: string;
    value: string;
    onKeyDown?: (ev) => void;
    className?: string;
    type: string;
    // style?: Partial<CSSProperties>;
    label?: string;
    required?: boolean;
    autoComplete?: string;
}

export const BaseField = (props: IBaseFieldProps) =>  {
    const {placeholder, className, name, label, onKeyDown, onChange, value, required, autoComplete, type} = props;

    // const onKeyDown = (ev) => {
    //     const key = ev.key;
    //     if(key === "Enter"){
    //         onSearch(value)
    //     }
    // };

    // const onChange = (ev) => {
    //     const value = ev?.target?.value;
    //     setState({...state, value})
    // };

    return (
        <label htmlFor={name} className={cls(css.label, className)}>
            {label && <span>{label}</span>}
            <input value={value || ""}
                   type={type}
                   id={name}
                   required={required}
                   name={name}
                   autoComplete={autoComplete}
                   className={css.input}
                   onKeyDown={onKeyDown}
                   onChange={onChange}
                   placeholder={placeholder}/>
        </label>
    )
};
