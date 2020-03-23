import * as React from "react";
import {useState} from "react";
import TextField from "@material-ui/core/TextField";
import {DialogContentText} from "@material-ui/core";
import {ToggleButtonGroup} from "@material-ui/lab";
import ToggleButton from "@material-ui/lab/ToggleButton";
import {hls, IChannel} from "../../../controllers/hls";
import {showDialog} from "../../../ui/dialog/dialog";
import DialogContent from "@material-ui/core/DialogContent";
import {EActionTypes, renderAction} from "../../../ui/dialog/dialog.action";

export async function showLoadPlaylistDialog(): Promise<Array<IChannel>> {
    const result = await showDialog<string | FileList>({title: 'Load playlist', children: (onSubmit, onCancel) => <LoadPlaylist onSubmit={onSubmit} onCancel={onCancel}/>});
    if(!result) return;

    return typeof result === "string" ? await hls.loadFromUrl(result) : await hls.loadFromFile(result)
}

interface ILoadPlaylistState {
    url: string
    files: FileList;
    isUrl: boolean;
};

function LoadPlaylist(props : {onSubmit: (value: string | FileList) => void, onCancel: () => void}){
    const {onSubmit, onCancel} = props;

    const [state, setState] = useState<ILoadPlaylistState>({url:null, files: null, isUrl: true});
    const {isUrl, url, files} = state;

    const onChange = (ev) => {
        const target = ev.target;
        let value;
        if(target.type === "file"){
            //fixme add support to load multiple playlists
            value = target.files[0];
            setState({...state, files: value});
        }else{
            value = target.value;
            setState({...state, url: value});
        }
    };

    const onChangeSelection = (ev, value) => {
        setState({...state, isUrl: value == "url"});
    };

    return (
        <>
            <DialogContentText>
                Type an URL or upload your playlist (M3U)
            </DialogContentText>
            <ToggleButtonGroup onChange={onChangeSelection}>
                <ToggleButton value={"url"} selected={isUrl}>Url</ToggleButton>
                <ToggleButton value={"file"} selected={!isUrl}>File</ToggleButton>
            </ToggleButtonGroup>
            {isUrl && (
                <TextField
                    autoFocus
                    margin="dense"
                    value={state.url}
                    onChange={onChange}
                    id="url"
                    label="Url"
                    fullWidth
                />
            )}
            {!isUrl && (
                <TextField
                    autoFocus
                    margin="dense"
                    onChange={onChange}
                    id="file"
                    label="File"
                    type="file"
                    fullWidth
                />
            )}
            {renderAction({type: EActionTypes.okCancel, onSubmit: () => onSubmit(isUrl ? url : files), onCancel})}
        </>
    )
}