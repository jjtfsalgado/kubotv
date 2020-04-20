import css from "./search.less"
import * as React from "react";
import {CSSProperties, useState} from "react";

import {cls} from "../../../utils/function";

interface ISearchProps {
    placeholder: string;
    onSearch: (value: string) => void;
    className?: string;
    style?: Partial<CSSProperties>;
}

interface ISearchState {
    value: string;
}

export const SearchField = (props: ISearchProps) =>  {
    const {placeholder, className, onSearch, style} = props;
    const [state, setState] = useState<ISearchState>({} as any);
    const {value} = state;

    const onKeyDown = (ev) => {
        const key = ev.key;
        if(key === "Enter"){
           onSearch(value)
        }
    };

    const onChange = (ev) => {
        const value = ev?.target?.value;
        setState({...state, value})
    };

    return (
        <div className={cls(css.search, className)} style={style}>
            <label htmlFor={"search"} title={"Search"}>
                <input value={value}
                       className={css.input}
                       onKeyDown={onKeyDown}
                       onChange={onChange}
                       placeholder={placeholder}/>
            </label>
        </div>
    )
};

