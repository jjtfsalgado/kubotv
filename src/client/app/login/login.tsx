import * as React from "react";
import {useReducer} from "react";
import {Button, TextField} from "@material-ui/core";
import axios from "axios";
import css from "./login.less"
import {useHistory} from "react-router-dom";
import * as H from "history";
import {_HEADER_AUTH_} from "../../../../global";
import localStorageCtrl from "../../controllers/localhost";

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

    const token = res.headers[_HEADER_AUTH_];

    axios.defaults.headers.common[_HEADER_AUTH_] = token;
    localStorageCtrl.tokenSet = token;
    history.push("/player");
}
