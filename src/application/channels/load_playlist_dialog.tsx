import {Dialog} from "../../components/dialog/dialog";
import * as React from "react";
import {DialogCtrl} from "../../components/dialog/ctrl";
import TextField from "@material-ui/core/TextField";
import {DialogContentText} from "@material-ui/core";

// interface IListDialogProps {
//     data: Array<IChannel>
// }

export class LoadPlaylistDialog extends Dialog<
    {},{
    url:string;
}>{

    constructor(props: any) {
        super(props);
        this.state = {} as any
    }

    static show = async () => await DialogCtrl.async(LoadPlaylistDialog, Object.assign({}, {title: "Load playlist", okText: "Load"}));

    getResult(): Promise<any> {
        const {url} = this.state;
        return new Promise((res, rej) => {
            res(url)
        });
    }

    renderBody(){
        return [
            <DialogContentText>
                Insert a valid URL or upload an M3U file
            </DialogContentText>,
            <TextField
                autoFocus
                margin="dense"
                onChange={this.onChange}
                id="name"
                label="Url"
                type="email"
                fullWidth
            />
        ];
    }

    onChange = (ev: any) => {
        this.setState({
            url:ev.target.value
        })
    }
}