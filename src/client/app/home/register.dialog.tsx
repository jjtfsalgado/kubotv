import * as React from "react";
import {useState} from "react";
import HttpController from "../../controllers/http";
import {Form, IFormInfo} from "../../ui/form/form";
import {HttpStatus} from "../../../utils/http_status";
import {AxiosResponse} from "axios";
import {TextField} from "../../ui/fields/text";

interface IRegisterFormState {
    email: string;
    password: string;
    password2: string;
}

interface IRegisterDialogProps {
    onSubmit: (value) => void;
}

export const RegisterDialog = (props: IRegisterDialogProps) => {
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

    const onSignUp = async () => {
        const res = await HttpController.post("/user", {email, password});
        if(!res) return;
        onSubmit(true);
    };

    return (
        <Form
              onSubmit={onSignUp}
              validations={validations}
              errorMessage={onErrorMessage}
              successMessage={{title: "Thank you for signing up", message: `We've sent you an email to ${email} to verify your account!`}}>
            <h3>Join us at kubo tv</h3>
            <TextField onChange={onChange}
                       name={"email"}
                       label={"Email"}
                       value={email}
                       required={true}/>
            <TextField onChange={onChange}
                       name={"password"}
                       label={"Password"}
                       value={password}
                       required={true}/>
            <TextField onChange={onChange}
                       name={"password2"}
                       label={"Confirm password"}
                       value={password2}
                       required={true}/>
        </Form>
    );
};
