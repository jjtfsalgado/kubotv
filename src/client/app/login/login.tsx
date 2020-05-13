import * as React from "react";
import {useState} from "react";
import axios from "axios";
import css from "./login.less"
import {withRouter} from "react-router-dom";
import * as H from "history";
import {_HEADER_AUTH_} from "../../../../global";
import localStorageCtrl from "../../controllers/localhost";
import {Form} from "../../ui/form/form";
import HttpController from "../../controllers/http";
import {TextField} from "../../ui/fields/text";
import {PasswordField} from "../../ui/fields/password";


export function Login() {
    return (
        <LoginForm/>
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
        <Form className={css.login}
              validations={validations}
              onSubmit={() => onLogin(email, password, history)}>

            <h3>Sign in to Kubo tv</h3>
            <TextField label={"Email"}
                       className={css.email}
                       onChange={onChange}
                       autoComplete={"username"}
                       name={"email"}
                       required={true}
                       value={email}/>
            <PasswordField  label={"Password"}
                            className={css.password}
                            autoComplete={"current-password"}
                            onChange={onChange}
                            name={"password"}
                            required={true}
                            value={password}/>
        </Form>
    )
});


async function onLogin(email: string, password: string, history: H.History<any>) {
    const res = await HttpController.post("/login", {email, password});
    //todo handle wrong password
    if (!res) return;

    const token = res.headers[_HEADER_AUTH_];

    axios.defaults.headers.common[_HEADER_AUTH_] = token;
    localStorageCtrl.tokenSet = token;
    localStorageCtrl.userId = res.data.UserId;
    history.push("/player");
}
