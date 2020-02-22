import {default as DialogMaterial} from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import * as React from "react";
import {ReactNode} from "react";


export abstract class Dialog<P, S> extends React.Component<P & {
    title: string;
    okText: string;
    onClose: () => void;
    onSuccess: (params: any) => void;
}, S & {
    data: any;
}> {


    render(){
        const {title, onClose, okText} = this.props;

        return (
            <DialogMaterial
                open={true}
                onClose={onClose}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    {this.renderBody()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.onSuccess} color="primary">
                        {okText}
                    </Button>
                    <Button onClick={onClose} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </DialogMaterial>
        );
    }

    private onSuccess = async () => {
        this.props.onSuccess(await this.getResult())
    };

    abstract getResult(): Promise<any>;
    // abstract show(props: any): Promise<any>;
    abstract renderBody(): ReactNode;
}
