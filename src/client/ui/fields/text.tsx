import * as React from "react";
import {BaseField, IBaseFieldProps} from "./base";

export const TextField = (props: Omit<IBaseFieldProps, 'type'>) =>  {
    return (
        <BaseField {...props} type={"text"}/>
    )
};
