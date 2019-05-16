import {default as DialogMaterial} from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import * as React from "react";
import {ClassType} from "react";
import * as ReactDOM from "react-dom"
import {string} from "prop-types";
import {render} from "react-dom";
import {App} from "../app";

export class Dialog {
    static async = function(c: ClassType<any, any, any>, props: {title: string, okText: string}): Promise<any>{
        const modalRoot = document.getElementById("modal-root");

        return new Promise((res, rej) => {
            const onClose = () => {
                res(false);
                ReactDOM.unmountComponentAtNode(modalRoot)
            };

            const onSuccess = () => {
                res(true);
                ReactDOM.unmountComponentAtNode(modalRoot)
            };

            const component = React.createElement(DialogUI, Object.assign(props, {onClose, onSuccess}), c);
            ReactDOM.render(component, modalRoot)
        });
   };

    static sync =  function(){

    };
}

class DialogUI extends React.Component<{
    title: string;
    okText: string;
    onClose: () => void;
    onSuccess: () => void;
,{}>{
    render(){
        const {title, onClose, onSuccess, okText, children} = this.props;

        return (
            <div>
            <DialogMaterial
                open={true}
                onClose={onClose}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    {children}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onSuccess} color="primary">
                        {okText}
                    </Button>
                    <Button onClick={onClose} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </DialogMaterial>
            </div>
        );
    }
}
