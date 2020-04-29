import * as React from "react";
import {EActionTypes, renderAction} from "../dialog.action";

export const ConfirmDialog = ({onSubmit, onCancel, message}) => {
    return (
        <>
            <span>{message}</span>
            {renderAction({type: EActionTypes.okCancel, onSubmit: () => onSubmit(true), onCancel})}
        </>
    )
};
