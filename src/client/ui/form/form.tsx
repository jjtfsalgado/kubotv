import {ReactNode, useEffect, useState} from "react";
import * as React from "react";
import {Button} from "@material-ui/core";

export interface IFormInfo{
    title: string,
    message: ReactNode
}

interface IFormValidation{
    condition: boolean,
    trigger?: "onblur" | "onchange"
    message?: string
}

interface IFormProps {
    onSubmit: () => Promise<any>;
    validations?: Array<IFormValidation>;
    successMessage?: IFormInfo;
    errorMessage?: (error) => IFormInfo;
    submitLabel?: string;
    children: ReactNode;
    className?: string;
}

interface IFormState {
    isBusy: boolean;
    error: IFormInfo;
    success: IFormInfo;
    errors: Array<IFormValidation>;
}

export const Form = (props: IFormProps) => {
    const {className, children, onSubmit, submitLabel, errorMessage, successMessage, validations} = props;
    const [state, setState] = useState<IFormState>({} as any);
    const {isBusy, errors} = state;
    
    const canSubmit = !errors || errors.length === 0;

    useEffect(() => {
        runValidations()
    }, [validations]);

    const runValidations = () => {
        const errors = validations.filter(i => i.condition);
        setState((prevState) => ({...prevState, errors}))
    };

    const _onSubmit = async (ev) => {
        ev.preventDefault();

        if(!canSubmit) return;

        try {
            setState((prevState) => ({...prevState, isBusy: true}));
            await onSubmit();
        } catch (e) {
            return setState((prevState) => ({...prevState, isBusy: false, error: errorMessage(e.response) || defaultErrorMessage(e.response)}));
        }

        setState((prevState) => ({...prevState, isBusy: false, success: successMessage}));
    };

    const renderChildren = () => {
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
        const v = errors && errors.filter(i => i.condition && i.message);
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
        <form className={className}
              onSubmit={_onSubmit}>
            {isBusy && (
                <div>Loading</div>
            )}
            {!isBusy && !(state.success || state.error) && renderChildren()}
            {!isBusy && (state.success || state.error) && renderInfo(state.error || state.success)}
        </form>
    )
};

const defaultErrorMessage = (e) => ({
    title: "Oops, something went wrong",
    message: `Please try again later`
});

Form.defaultProps = {
    errorMessage: defaultErrorMessage
} as IFormProps;
