import * as React from "react";
import {useState} from "react";
import axios from "axios";
import {_HEADER_AUTH_} from "../../../../global";
import localStorageCtrl from "../../controllers/localhost";
import {Form} from "../../ui/form/form";
import HttpController from "../../controllers/http";
import {TextField} from "../../ui/fields/text";
import {PasswordField} from "../../ui/fields/password";
import {showDialog} from "../../ui/dialog/dialog";

import css from "./login.dialog.less"

interface ILoginState {
    email: string;
    password: string;
}

interface ILoginProps {
    onSubmit: (value) => void;
}

export const onLogin = async (history) => {
    const res = await showDialog.async({title: "Sign in", children: (onSubmit, onCancel) => <LoginDialog onSubmit={onSubmit}/>});
    if(!res) return;

    history.push("/player");
};

const LoginDialog = (props: ILoginProps) => {
    const {onSubmit} = props;
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

    const onLogin = async () => {
        const res = await HttpController.post("/login", {email: email?.toLowerCase(), password});
        //todo handle wrong password
        if (!res) return;

        const token = res.headers[_HEADER_AUTH_];

        axios.defaults.headers.common[_HEADER_AUTH_] = token;
        localStorageCtrl.tokenSet = token;
        localStorageCtrl.userId = res.data.UserId;
        onSubmit(true);
    };

    return (
        <Form validations={validations}
              onSubmit={onLogin}>
            <h3>Welcome back!</h3>
            <TextField label={"Email"}
                       onChange={onChange}
                       autoComplete={"username"}
                       className={css.field}
                       name={"email"}
                       required={true}
                       value={email}/>
            <PasswordField  label={"Password"}
                            autoComplete={"current-password"}
                            onChange={onChange}
                            className={css.field}
                            name={"password"}
                            required={true}
                            value={password}/>
        </Form>
    )
};
