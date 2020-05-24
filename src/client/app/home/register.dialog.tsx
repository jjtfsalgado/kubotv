import * as React from "react";
import {useState} from "react";
import HttpController from "../../controllers/http";
import {Form, IFormInfo} from "../../ui/form/form";
import {HttpStatus} from "../../../utils/http_status";
import {AxiosResponse} from "axios";
import {TextField} from "../../ui/fields/text";
import {showDialog} from "../../ui/dialog/dialog";

import css from "./register.dialog.less"
import {PasswordField} from "../../ui/fields/password";

interface IRegisterFormState {
    email: string;
    password: string;
    password2: string;
}

interface IRegisterDialogProps {
    onSubmit: (value) => void;
}

export const onRegister = async () => {
    const res = await showDialog.async({title: "Register", children: (onSubmit, onCancel) => <RegisterDialog onSubmit={onSubmit}/>});
    if(!res) return;
};

const RegisterDialog = (props: IRegisterDialogProps) => {
    const {onSubmit} = props;
    const [state, setState] = useState<IRegisterFormState>({} as any);
    const {email, password, password2} = state;

    const onChange = (e) => {
        const {name, value} = e.target;
        setState({...state, [name]: value});
    };

    const validations = [
        {
            condition: !email || !password || !password2
        },
        {
            condition: password && password2 && password !== password2,
            message: "Passwords don't match"
        },
        {
            condition: email && !(/\S+@\S+\.\S+/.test(email)),
            message: "Your email is not valid"
        }
    ];

    const onErrorMessage = (e: AxiosResponse): IFormInfo => {
        if (e.status === HttpStatus.ERROR.CLIENT.CONFLICT.code) {
            return {
                message: "This email is already registered",
                title: "Please login"
            }
        }
    };

    const onSignUp = async () => {
        await HttpController.post("/user", {email, password});
    };

    return (
        <Form
              onSubmit={onSignUp}
              validations={validations}
              errorMessage={onErrorMessage}
              successMessage={{title: "Thank you for signing up!", message: `We just need you to verify your email and you are good to go. \n We've sent you an email to ${email}. `}}>
            <h3>Join us at kubo tv</h3>
            <TextField onChange={onChange}
                       name={"email"}
                       className={css.field}
                       label={"Email"}
                       value={email}
                       required={true}/>
            <PasswordField onChange={onChange}
                       name={"password"}
                       className={css.field}
                       label={"Password"}
                       value={password}
                       required={true}/>
            <PasswordField onChange={onChange}
                       name={"password2"}
                       className={css.field}
                       label={"Confirm password"}
                       value={password2}
                       required={true}/>
        </Form>
    );
};
