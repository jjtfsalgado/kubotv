import {Dialog} from "../../components/dialog/dialog";
import {List} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import * as React from "react";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import {ClassType} from "react";
import {DialogCtrl} from "../../components/dialog/ctrl";

interface IListDialogProps {
    data: Array<any>
}


export class ListDialog extends Dialog<
    IListDialogProps,{
    selectedItems: Array<any>
}>{

    constructor(props: any) {
        super(props);

        this.state = {
            selectedItems: ["boo"]
        } as any
    }

    static show = async (props: IListDialogProps) => await DialogCtrl.async(ListDialog, Object.assign(props, {title: "Select channels", okText: "Ok"}));

    // handleToggle = value => () => {
    //     const { checked } = this.state;
    //     const currentIndex = checked.indexOf(value);
    //     const newChecked = [...checked];
    //
    //     if (currentIndex === -1) {
    //         newChecked.push(value);
    //     } else {
    //         newChecked.splice(currentIndex, 1);
    //     }
    //
    //     this.setState({
    //         checked: newChecked,
    //     });
    // };

    getResult(): Promise<any> {
        const {selectedItems} = this.state;
        return new Promise((res, rej) => {
            res(selectedItems)
        });
    }


    renderBody(){
        return (
            <List>
                {[0, 1, 2, 3].map(value => (
                    <ListItem key={value} role={undefined} dense button>
                        {/*<Checkbox*/}
                        {/*    checked={this.state.checked.indexOf(value) !== -1}*/}
                        {/*    tabIndex={-1}*/}
                        {/*    disableRipple*/}
                        {/*/>*/}
                        <ListItemText primary={`Line item ${value + 1}`} />
                    </ListItem>
                ))}
            </List>
        );
    }
}