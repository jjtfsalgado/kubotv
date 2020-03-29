import * as React from "react";
import {useState} from "react";
import {TextField} from "@material-ui/core";
import {withRouter} from "react-router-dom";
import * as H from "history";
import css from "./register.less"
import {Dialog} from "../../ui/dialog/dialog";
import HttpController from "../../controllers/http";
import {Form} from "../../ui/form/form";

export function Register() {
    return (
        <Dialog title={"Sign up"}>
            <RegisterForm/>
        </Dialog>
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
        }
    ];

    return (
        <Form className={css.register}
              onSubmit={() => onSignUp(email, password, history)}
              validations={validations}
              successMessage={{title: "Thank you for signing up", message: `We've sent you an email to ${email} to verify your account!`}}>
            <TextField required={true}  label={"Email"} value={email} name={"email"} onChange={onChange}/>
            <TextField required={true} type={"password"} label={"Password"} value={password} name="password" onChange={onChange}/>
            <TextField required={true} type={"password"} label={"Confirm password"} value={password2} name="password2" onChange={onChange}/>
        </Form>
    );
});

async function onSignUp(email: string, password: string, history: H.History<any>){
    const res = await HttpController.post("/user", {email, password});
    if(!res) return;
}
