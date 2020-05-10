import * as React from "react";
import {EActionTypes, renderAction} from "../dialog.action";

import css from "../dialog.less";

export const ConfirmDialog = ({onSubmit, onCancel, message}) => {
    return (
        <div className={css.confirm}>
            <div className={css.body}>{message}</div>
            {renderAction({type: EActionTypes.okCancel, onSubmit: () => onSubmit(true), onCancel})}
        </div>
    )
};
