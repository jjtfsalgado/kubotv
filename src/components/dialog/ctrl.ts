import * as ReactDOM from "react-dom";
import {ClassType} from "react";
import * as React from "react";

export class DialogCtrl {
    static async = function(c: ClassType<any, any, any>, props: {title: string, okText: string}): Promise<any>{
        const modalRoot = document.getElementById("modal-root");

        return new Promise((res, rej) => {
            const onClose = () => {
                res(false);
                ReactDOM.unmountComponentAtNode(modalRoot)
            };

            const onSuccess = (params: any) => {
                res(params);
                ReactDOM.unmountComponentAtNode(modalRoot)
            };

            const component = React.createElement(c, Object.assign(props, {onClose, onSuccess}));
            ReactDOM.render(component, modalRoot)
        });
    };

    static sync =  function(){

    };
}