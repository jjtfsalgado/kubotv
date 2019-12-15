import {Dialog} from "../../../ui/dialog/base/dialog";
import * as React from "react";
import {DialogCtrl} from "../../../ui/dialog/base/ctrl";
import TextField from "@material-ui/core/TextField";
import {DialogContentText} from "@material-ui/core";
import {nullProp, readFile} from "../../../../utils/function";
import {hls} from "../../../controllers/hls";

export class LoadPlaylistDialog extends Dialog<{},{}>{
    constructor(props: any) {
        super(props);

        this.urlRef = React.createRef();
        this.fileRef = React.createRef();
    }

    urlRef: React.RefObject<any>;
    fileRef: React.RefObject<any>;

    static show = async () => await DialogCtrl.async(LoadPlaylistDialog, Object.assign({}, {title: "Load playlist", okText: "Load"}));

    async getResult(): Promise<any> {
        const url = nullProp(this.urlRef, i => i.current, i => i.value);
        const file = nullProp(this.fileRef, i => i.current, i => i.files[0]);

        if(!!url){
            return await hls.loadFromUrl(url)
        }else if(!!file){
            return await hls.loadFromFile(file)
        }
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
                id="url"
                label="Url"
                fullWidth
            />,
            <TextField
                inputRef={this.fileRef}
                autoFocus
                margin="dense"
                id="file"
                label="File"
                type="file"
                fullWidth
            />
        ];
    }
}