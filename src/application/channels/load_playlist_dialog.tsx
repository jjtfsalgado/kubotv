import {Dialog} from "../../components/dialog/dialog";
import * as React from "react";
import {DialogCtrl} from "../../components/dialog/ctrl";
import TextField from "@material-ui/core/TextField";
import {DialogContentText} from "@material-ui/core";

export class LoadPlaylistDialog extends Dialog<{},{}>{
    constructor(props: any) {
        super(props);

        this.urlRef = React.createRef();
        this.fileRef = React.createRef();
    }

    urlRef: React.RefObject<any>;
    fileRef: React.RefObject<any>;

    static show = async () => await DialogCtrl.async(LoadPlaylistDialog, Object.assign({}, {title: "Load playlist", okText: "Load"}));

    getResult(): Promise<any> {
        const {url} = this.state;
        this.fileRef
        this.urlRef

        // return new Promise((res, rej) => {
        //     res(url)
        // });
    }

    renderBody(){
        return [
            <DialogContentText>
                Insert a valid URL or upload an M3U file
            </DialogContentText>,
            <TextField
                autoFocus
                inputRef={this.urlRef}
                margin="dense"
                onChange={this.onChange}
                id="url"
                label="Url"
                fullWidth
            />,
            <TextField
                inputRef={this.fileRef}
                autoFocus
                margin="dense"
                onChange={this.onChange}
                id="file"
                label="File"
                type="file"
                fullWidth
            />
        ];
    }
}