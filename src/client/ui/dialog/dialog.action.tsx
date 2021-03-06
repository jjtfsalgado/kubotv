import * as React from "react";
import {Button} from "../button/button";
import css from "./dialog.less";

export type TAction<T> = IDialogActionsNoneProps | IDialogActionsOkCancelProps<T>;

export const enum EActionTypes {
    okCancel = 'okCancel',
    none = 'none'
}

export interface IDialogActionsNoneProps{
    type: EActionTypes.none
}

export interface IDialogActionsOkCancelProps<T>{
    type: EActionTypes.okCancel;
    disabled?: boolean;
    onSubmit: () => void;
    onCancel: () => void;
}

export function DialogActionsOkCancel<T>(props: IDialogActionsOkCancelProps<T>){
    const {onSubmit, onCancel, disabled} = props;

    return (
        <div className={css.actions}>
            <Button onClick={onSubmit} type={"primary"} disabled={disabled} text={"Ok"}/>
            <Button onClick={onCancel} text={"Cancel"}/>
        </div>
    )
}

export const renderAction = <T extends unknown>(action: TAction<T>) => {
    switch (action.type) {
        case "okCancel":
            return <DialogActionsOkCancel {...action}/>;
        case "none":
            return null;
    }
};
