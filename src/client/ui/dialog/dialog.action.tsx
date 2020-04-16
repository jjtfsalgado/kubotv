import * as React from "react";

export type TAction<T> = IDialogActionsNoneProps | IDialogActionsOkCancelProps<T>;

export const enum EActionTypes {
    okCancel = 'okCancel',
    none = 'none'
}

export interface IDialogActionsNoneProps{
    type: EActionTypes.none
}

export interface IDialogActionsOkCancelProps<T>{
    type: EActionTypes.okCancel
    onSubmit: () => void;
    onCancel: () => void;
}

export function DialogActionsOkCancel<T>(props: IDialogActionsOkCancelProps<T>){
    const {onSubmit, onCancel} = props;

    return (
        <>
            <button onClick={onSubmit}>Ok</button>
            <button onClick={onCancel}> Cancel </button>
        </>
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
