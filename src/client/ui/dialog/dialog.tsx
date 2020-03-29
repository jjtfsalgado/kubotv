import * as React from "react";
import {ReactNode} from "react";
import * as ReactDOM from "react-dom";
import {createPortal} from "react-dom";
import {cls} from "../../../utils/function";
import css from "./dialog.less";
import {_MODAL_ROOT_} from "../../../../global";

function unMountDialog() {
    ReactDOM.unmountComponentAtNode(document.getElementById(_MODAL_ROOT_));
}

export interface IDialog<T> {
    title?: string;
    // children: (onSubmit: (value: T) => void, onCancel: () => void) => ReactNode;
}

// export function showDialog<T>({children, title}: IDialog<T>): Promise<T | false> {
//
//     return new Promise((res) => {
//         const onSubmit = (value?: T) => res(value);
//         const onCancel = () => res(false);
//
//         ReactDOM.render(<Dialog children={children}
//                                  title={title}
//                                  onSubmit={onSubmit}
//                                  onCancel={onCancel}/>, _MODAL_ROOT_);
//     });
// }

interface IDialogContainer<T>{
    isModal?: boolean;
    title: string;
    children: ReactNode;
}

export function Dialog<T>(props: IDialogContainer<T>) {
    const {title, isModal, children} = props;

    return (
        createPortal(
            <div className={css.container}>
                <div className={cls(css.dialog, isModal && css.modal)}>
                    <div className={css.title}>
                        {title}
                    </div>
                    <div className={css.content}>
                        {children}
                    </div>
                </div>
            </div>,
            document.getElementById(_MODAL_ROOT_)
        )
    )
}


