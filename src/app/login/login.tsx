import * as React from "react";
import {Button, TextField} from "@material-ui/core";

import css from "./login.less"

export function Login() {
    return (
        <div className={css.login}>

            <div className={css.form}>
                <TextField label={"Email"}/>
                <TextField label={"Password"}/>

                <Button type={"submit"}>Submit</Button>

            </div>
        </div>
    )
}