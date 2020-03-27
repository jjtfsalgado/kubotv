import * as React from "react";
import {useReducer, useState} from "react";
import {Button, TextField} from "@material-ui/core";
import axios from "axios";
import css from "./login.less"
import {withRouter} from "react-router-dom";
import * as H from "history";
import {_HEADER_AUTH_} from "../../../../global";
import localStorageCtrl from "../../controllers/localhost";
import {Dialog} from "../../ui/dialog/dialog";


export function Login() {
    return (
        <div className={css.login}>
            <Dialog title={"Login"}>
                <LoginForm/>
            </Dialog>
        </div>
    )
}

interface ILoginState {
    email: string;
    password: string;
}

const LoginForm = withRouter((props) => {
    const {history} = props;

    const [state, setState] = useState<ILoginState>({} as any);
    const {email, password} = state;

    const onChange = (e) => {
        const {name, value} = e.target;
        setState({...state, [name]: value});
    };

    return (
        <div className={css.form}>
            <TextField label={"Email"} value={email} name={"email"} onChange={onChange}/>
            <TextField label={"Password"} value={password} name="password" onChange={onChange}/>
            <Button type={"submit"} onClick={() => onLogin(email, password, history)}>Submit</Button>
        </div>
    )
});


async function onLogin(email: string, password: string, history: H.History<any>){
    const res = await axios.post("/login", {email, password});

    //todo handle wrong password
    if(!res) return;

    const token = res.headers[_HEADER_AUTH_];

    axios.defaults.headers.common[_HEADER_AUTH_] = token;
    localStorageCtrl.tokenSet = token;
    localStorageCtrl.userId = res.data.UserId;
    history.push("/player");
}
