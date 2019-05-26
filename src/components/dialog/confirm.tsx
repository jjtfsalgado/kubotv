import {Dialog} from "../../components/dialog/base/dialog";
import {DialogContentText} from "@material-ui/core";
import * as React from "react";
import {DialogCtrl} from "../../components/dialog/base/ctrl";

interface IConfirmDialogProps {
    message: string;
    title: string;
}

export class ConfirmDialog extends Dialog<
    IConfirmDialogProps,
{}>{

    constructor(props: any) {
        super(props);

        this.state = {
            selectedItems: new Set(props.data)
        } as any
    }

    static show = async (props: IConfirmDialogProps) => await DialogCtrl.async(ConfirmDialog, Object.assign(props, {okText: "Ok"}));

    getResult(): Promise<any> {
        return new Promise((res, rej) => {
            res(true)
        });
    }

    renderBody(){
        const {message} = this.props;

        return (
            <DialogContentText>
                {message}
            </DialogContentText>
        );
    }
}