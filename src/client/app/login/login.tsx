import * as React from "react";
import {Button, TextField} from "@material-ui/core";
import axios from "axios";
import css from "./login.less"
import {useReducer} from "react";

interface IAction<T>{
    property: string,
    value: T
}

function reducer(state, action: IAction<any>) {
    return {...state, [action.property]: action.value}
}

export function Login() {
    const [state, dispatch] = useReducer(reducer, {});
    const {email, password} = state;

    const onChange = (e) => {
        const {name, value} = e.target;

        console.log(name, value);

        dispatch({property: name, value});
    };


    return (
        <div className={css.login}>
            <div className={css.form}>
                <TextField label={"Email"} value={email} name={"email"} onChange={onChange}/>
                <TextField label={"Password"} value={password} name="password" onChange={onChange}/>
                <Button type={"submit"} onClick={() => onLogin(email, password)}>Submit</Button>
            </div>
        </div>
    )
}

async function onLogin(email: string, password: string){
    const res = await axios.post("/login", {email, password});
    axios.defaults.headers.common['x-auth'] = res.headers['x-auth'];

}
