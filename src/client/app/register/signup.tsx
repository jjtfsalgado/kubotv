import * as React from "react";
import {useReducer} from "react";
import {Button, TextField} from "@material-ui/core";
import axios from "axios";
import {reducer} from "../login/login";

import css from "./signup.less"

export function SignUp() {
    const [state, dispatch] = useReducer(reducer, {});
    const {email, password} = state;

    const onChange = (e) => {
        const {name, value} = e.target;
        dispatch({property: name, value});
    };

    return (
        <div className={css.register}>
            <div className={css.form}>
                <TextField label={"Email"} value={email} name={"email"} onChange={onChange}/>
                <TextField label={"Password"} value={password} name="password" onChange={onChange}/>
                <Button type={"submit"} onClick={() => onSingUp(email, password)}>Sign up</Button>
            </div>
        </div>
    )
}

async function onSingUp(email: string, password: string){
    const res = await axios.post("/user", {email, password});

    if(!res) return;


    //todo inform that we've sent an email

    // history.push("/player");
}
