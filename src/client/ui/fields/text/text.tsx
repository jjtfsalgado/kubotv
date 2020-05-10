import css from "./text.less";
import * as React from "react";
import {cls} from "../../../../utils/function";

interface ITextFieldProps {
    placeholder: string;
    onChange: (ev) => void;
    name: string;
    value: string;
    onKeyDown?: (ev) => void;
    className?: string;
    // style?: Partial<CSSProperties>;
    label?: string;
}

export const TextField = (props: ITextFieldProps) =>  {
    const {placeholder, className, name, label, onKeyDown, onChange, value} = props;

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
                   type={"text"}
                   name={name}
                   autoComplete={"off"}
                   className={css.input}
                   onKeyDown={onKeyDown}
                   onChange={onChange}
                   placeholder={placeholder}/>
        </label>
    )
};
