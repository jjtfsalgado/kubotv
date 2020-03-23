import DialogTitle from "@material-ui/core/DialogTitle";
import * as React from "react";
import {ReactNode} from "react";
import * as ReactDOM from "react-dom";
import {DialogContent, Dialog} from "@material-ui/core";

const _MODAL_ROOT_ = document.getElementById("modal-root");

function unMountModal() {
    ReactDOM.unmountComponentAtNode(_MODAL_ROOT_);
}

export interface IDialog<T> {
    title?: string;
    children: (onSubmit: (value: T) => void, onCancel: () => void) => ReactNode;
}

export function showDialog<T>({children, title}: IDialog<T>): Promise<T | false> {
    return new Promise((res) => {
        const onSubmit = (value?: T) => {
            res(value);
            unMountModal();
        };

        const onCancel = () => {
            res(false);
            unMountModal()
        };

        ReactDOM.render(<DialogContainer children={children}
                                         title={title}
                                         onSubmit={onSubmit}
                                         onCancel={onCancel}/>, _MODAL_ROOT_);
    });
}

interface IDialogContainer<T> extends IDialog<any> {
    onSubmit?: (value: T) => void;
    onCancel?: () => void;
}

function DialogContainer<T>(props: IDialogContainer<T>) {
    const {title, children, onSubmit, onCancel} = props;

    return (
        <Dialog
            open={true}
            aria-labelledby="form-dialog-title">
            {title && <DialogTitle id="form-dialog-title">{title}</DialogTitle>}
            <DialogContent>
                {children(onSubmit, onCancel)}
            </DialogContent>
        </Dialog>
    )
}


