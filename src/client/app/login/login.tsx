import * as React from "react";
import {Button, TextField} from "@material-ui/core";
import axios from "axios";
import css from "./login.less"
import {useReducer} from "react";
import * as bcrypt from "bcryptjs";
import {useHistory} from "react-router-dom";
import * as H from "history";

interface IAction<T>{
    property: string,
    value: T
}

//todo find a better place for this
export function reducer(state, action: IAction<any>) {
    return {...state, [action.property]: action.value}
}

export function Login() {
    const [state, dispatch] = useReducer(reducer, {});
    const {email, password} = state;

    const onChange = (e) => {
        const {name, value} = e.target;
        dispatch({property: name, value});
    };

    const history = useHistory();

    return (
        <div className={css.login}>
            <div className={css.form}>
                <TextField label={"Email"} value={email} name={"email"} onChange={onChange}/>
                <TextField label={"Password"} value={password} name="password" onChange={onChange}/>
                <Button type={"submit"} onClick={() => onLogin(email, password, history)}>Submit</Button>
            </div>
        </div>
    )
}

async function onLogin(email: string, password: string, history: H.History<any>){

    const res = await axios.post("/login", {email, password});

    //todo handle wrong password
    if(!res) return;

    axios.defaults.headers.common['x-auth'] = res.headers['x-auth'];
    history.push("/player");
}
