import * as React from "react";
import {useState} from "react";
import TextField from "@material-ui/core/TextField";
import {ToggleButtonGroup} from "@material-ui/lab";
import ToggleButton from "@material-ui/lab/ToggleButton";
import {EActionTypes, renderAction} from "../../ui/dialog/dialog.action";

interface ILoadPlaylistState {
    url: string
    files: FileList;
    isUrl: boolean;
};

export function LoadPlaylist(props : {onSubmit: (value: string | FileList) => void, onCancel: () => void}){
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
            <div>Type an URL or upload your playlist (M3U)</div>
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
