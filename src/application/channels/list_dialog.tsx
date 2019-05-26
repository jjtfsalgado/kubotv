import {Dialog} from "../../components/dialog/base/dialog";
import {List} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import * as React from "react";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import {DialogCtrl} from "../../components/dialog/base/ctrl";
import {IChannel} from "../../controllers/hls";

interface IListDialogProps {
    data: Array<IChannel>
}

export class ListDialog extends Dialog<
    IListDialogProps,{
    selectedItems: Set<IChannel>
}>{

    constructor(props: any) {
        super(props);

        this.state = {
            selectedItems: new Set(props.data)
        } as any
    }

    static show = async (props: IListDialogProps) => await DialogCtrl.async(ListDialog, Object.assign(props, {title: "Select channels", okText: "Ok"}));


    getResult(): Promise<any> {
        const {selectedItems} = this.state;
        return new Promise((res, rej) => {
            res(Array.from(selectedItems))
        });
    }

    renderBody(){
        const {data} = this.props;
        const {selectedItems} = this.state;

        return (
            <List>
                {data.map((i) => (
                    <ListItem key={i.url} role={undefined} dense button onClick={() => this.onClickItem(i)}>
                        <Checkbox
                            checked={selectedItems.has(i)}
                            tabIndex={-1}
                            disableRipple
                        />
                        <ListItemText primary={i.title}/>
                    </ListItem>
                ))}
            </List>
        );
    }

    onClickItem = (i: IChannel) => {
        const {selectedItems} = this.state;
        selectedItems.has(i) ? selectedItems.delete(i) : selectedItems.add(i);
        this.setState({
            selectedItems
        })
    }
}