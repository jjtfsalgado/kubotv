import * as React from "react";
import {BaseField, IBaseFieldProps} from "./base";

export const PasswordField = (props: Omit<IBaseFieldProps, 'type'>) =>  {
    return (
        <BaseField {...props} type={"password"}/>
    )
};
