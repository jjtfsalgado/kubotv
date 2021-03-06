import * as React from "react";
import {CSSProperties, useState} from "react";
import {TextField} from "../fields/text";

import css from "./search.less";
import {cls} from "../../../utils/function";
import {useSelector} from "react-redux";
import {IRootState} from "../../reducers";

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
    const {onSearch, className} = props;
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
        <TextField placeholder={"Search"}
                   className={cls(css.search, className)}
                   autoComplete={"off"}
                   onChange={onChange}
                   value={value}
                   name={"search"}
                   onKeyDown={onKeyDown}/>
    )
};

