import {ReactNode, useState} from "react";
import * as React from "react";
import {Button} from "@material-ui/core";

interface IFormInfo{
    title: string,
    message: ReactNode
}

interface IFormValidation{
    condition: boolean,
    message?: string
}

interface IFormProps {
    onSubmit: () => Promise<any>;
    validations?: Array<IFormValidation>;
    successMessage?: IFormInfo;
    errorMessage?: IFormInfo;
    submitLabel?: string;
    children: ReactNode;
    className?: string;
}

interface IFormState {
    isBusy: boolean;
    error: IFormInfo;
    success: IFormInfo;
}

export const Form = (props: IFormProps) => {
    const {className, children, onSubmit, submitLabel, errorMessage, successMessage, validations} = props;
    const [state, setState] = useState<IFormState>({} as any);
    const {isBusy} = state;

    const _onSubmit = async () => {
        try {
            setState((prevState) => ({...prevState, isBusy: true}));
            await onSubmit();
        } catch (e) {
            setState((prevState) => ({...prevState, isBusy: false, error: errorMessage}));
        } finally {
            setState((prevState) => ({...prevState, isBusy: false, success: successMessage}));
        }
    };

    const renderChildren = () => {
        const canSubmit = !validations || !validations.some(i => i.condition);

        return (
            <>
                {children}
                {renderValidations()}
                <Button type={"submit"}
                        disabled={!canSubmit}
                        onClick={_onSubmit}>
                    {submitLabel || "Submit"}
                </Button>
            </>
        )
    };

    const renderValidations = () => {
        const v = validations && validations.filter(i => i.condition && i.message);
        return v && v.map(k => <span>{k.message}</span>)
    };

    const renderInfo = (props: IFormInfo) => {
        return (
            <div>
                <h3>{props.title}</h3>
                <div>{props.message}</div>
            </div>
        )
    };

    return (
        <div className={className}>
            {isBusy && (
                <div>Loading</div>
            )}
            {!isBusy && !(state.success || state.error) && renderChildren()}
            {!isBusy && (state.success || state.error) && renderInfo(state.error || state.success)}
        </div>
    )
};

Form.defaultProps = {
    errorMessage: {
        title: "Oops, something went wrong",
        message: `Please try again later`
    }
} as IFormProps;
