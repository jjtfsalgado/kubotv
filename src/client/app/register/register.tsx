import * as React from "react";
import {useState} from "react";
import {Button, TextField} from "@material-ui/core";
import axios from "axios";

import css from "./register.less"
import {Dialog} from "../../ui/dialog/dialog";

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
}

const RegisterForm = (props) => {
    const {history} = props;

    const [state, setState] = useState<IRegisterFormState>({} as any);
    const {email, password} = state;

    const onChange = (e) => {
        const {name, value} = e.target;
        setState({...state, [name]: value});
    };

    return (
        <div className={css.register}>
            <TextField label={"Email"} value={email} name={"email"} onChange={onChange}/>
            <TextField label={"Password"} value={password} name="password" onChange={onChange}/>
            <Button type={"submit"} onClick={() => onSingUp(email, password)}>Sign up</Button>
        </div>
    );
};

async function onSingUp(email: string, password: string){
    const res = await axios.post("/user", {email, password});

    if(!res) return;


    //todo inform that we've sent an email

    // history.push("/player");
}
