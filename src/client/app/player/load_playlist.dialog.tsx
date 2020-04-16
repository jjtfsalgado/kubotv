import * as React from "react";
import {useState} from "react";
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
            <button onClick={(ev) => onChangeSelection(ev, "url")} aria-pressed={"true"}>Url</button>
            <button onClick={(ev) => onChangeSelection(ev, "file")}>File</button>

            {isUrl && (
                <label htmlFor="url" title="Url">
                    <input  value={state.url}
                            type={"text"}
                            onChange={onChange}
                            id="url"/>
                </label>
            )}
            {!isUrl && (
                <label htmlFor="file" title={"File"}>
                    <input onChange={onChange}
                           id="file"
                           type="file"/>
                </label>
            )}

            {renderAction({type: EActionTypes.okCancel, onSubmit: () => onSubmit(isUrl ? url : files), onCancel})}
        </>
    )
}
