import * as React from "react";
import css from "./toolbar.less"
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/core/SvgIcon/SvgIcon";
import AppBar from "@material-ui/core/AppBar";
import Tools from '@material-ui/core/Toolbar';
import {cls} from "../../../utils/function";

export function ToolBar (props){
    return (
        <div className={cls(css.toolbar, props.className)}>
            {props.children}
        </div>
    )
}