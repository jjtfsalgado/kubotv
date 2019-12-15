import {InputBase} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from '@material-ui/icons/Search';

import css from "./search.less"
import * as React from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import {debounce} from "../../../utils/function";

export class Search extends React.Component<{
    placeholder: string;
    onChange: (value: string) => void;
}, {
    value: string;
}> {
    constructor(props: any) {
        super(props);

        this.state = {} as any;
    }

    render() {
        const {placeholder} = this.props;
        const {value} = this.state;

        return (
            <div className={css.search}>
                <TextField className={css.input}
                           value={value}
                           margin={"normal"}
                           onChange={(ev) => debounce(this.onChange(ev), this, 100000)}
                           InputProps={{
                               endAdornment: (
                                   <InputAdornment position="end">
                                       <SearchIcon/>
                                   </InputAdornment>
                               )
                           }}
                           placeholder={placeholder}/>
            </div>
        )
    }

    onChange = (ev: any) => {
        const value = ev.target.value;
        this.props.onChange(value);
    }
}