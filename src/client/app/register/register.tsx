import * as React from "react";
import {Button, TextField} from "@material-ui/core";

import css from "./register.less"

export function Register() {
    return (
        <div className={css.register}>

            <div className={css.form}>
                Sign up

                <TextField label={"Email"}/>
                <TextField label={"Password"}/>

                <Button type={"submit"}>Submit</Button>

            </div>
        </div>
    )
}