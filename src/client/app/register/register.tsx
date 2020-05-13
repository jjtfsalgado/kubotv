import * as React from "react";
import {useState} from "react";
import {withRouter} from "react-router-dom";
import * as H from "history";
import css from "./register.less"
import HttpController from "../../controllers/http";
import {Form, IFormInfo} from "../../ui/form/form";
import {HttpStatus} from "../../../utils/http_status";
import {AxiosResponse} from "axios";
import {TextField} from "../../ui/fields/text";

export function Register() {
    return (
        <RegisterForm/>
    )
}

interface IRegisterFormState {
    email: string;
    password: string;
    password2: string;
}

const RegisterForm = withRouter((props) => {
    const [state, setState] = useState<IRegisterFormState>({} as any);
    const {email, password, password2} = state;
    const {history} = props;

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
            message: "Your passwords don't match"
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

    return (
        <Form className={css.register}
              onSubmit={() => onSignUp(email, password, history)}
              validations={validations}
              errorMessage={onErrorMessage}
              successMessage={{title: "Thank you for signing up", message: `We've sent you an email to ${email} to verify your account!`}}>
            <h3>Join us at Kubo tv</h3>
            <TextField onChange={onChange}
                       className={css.email}
                       name={"email"}
                       label={"Email"}
                       value={email}
                       required={true}/>
            <TextField onChange={onChange}
                       name={"password"}
                       className={css.password}
                       label={"Password"}
                       value={password}
                       required={true}/>
            <TextField onChange={onChange}
                       name={"password2"}
                       className={css.password}
                       label={"Confirm password"}
                       value={password2}
                       required={true}/>
        </Form>
    );
});

async function onSignUp(email: string, password: string, history: H.History<any>){
    const res = await HttpController.post("/user", {email, password});
    if(!res) return;
}
