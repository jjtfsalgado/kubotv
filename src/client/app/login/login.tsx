import * as React from "react";
import {useState} from "react";
import axios from "axios";
import css from "./login.less"
import {withRouter} from "react-router-dom";
import * as H from "history";
import {_HEADER_AUTH_} from "../../../../global";
import localStorageCtrl from "../../controllers/localhost";
import {Dialog} from "../../ui/dialog/dialog";
import {Form} from "../../ui/form/form";
import HttpController from "../../controllers/http";


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

    const validations = [
        {
            condition: !email || !password
        }
    ];

    return (
        <Form className={css.form}
              validations={validations}
              onSubmit={() => onLogin(email, password, history)}>
            <label htmlFor={"email"}>
                Email
                <input type={"text"}
                       id={"email"}
                       required={true}
                       value={email}
                       name={"email"}
                       onChange={onChange}/>
            </label>
            <label htmlFor={"password"}>
                Password
                <input required={true}
                       id={"password"}
                       value={password}
                       name="password"
                       onChange={onChange}/>
            </label>
        </Form>
    )
});


async function onLogin(email: string, password: string, history: H.History<any>){
    const res = await HttpController.post("/login", {email, password});
    //todo handle wrong password
    if(!res) return;

    const token = res.headers[_HEADER_AUTH_];

    axios.defaults.headers.common[_HEADER_AUTH_] = token;
    localStorageCtrl.tokenSet = token;
    localStorageCtrl.userId = res.data.UserId;
    history.push("/player");
}
