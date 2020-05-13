import * as React from "react";
import {useState} from "react";
import {EActionTypes, renderAction} from "../../ui/dialog/dialog.action";
import {TextField} from "../../ui/fields/text";
import {Button} from "../../ui/button/button";
import css from "./load_playlist.dialog.less";

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
        <div className={css.load}>
            <div className={css.body}>
                <span className={css.text}>Type an URL or upload your playlist (M3U)</span>

                <div className={css.buttons}>
                    <Button onClick={(ev) => onChangeSelection(ev, "url")}
                            type={isUrl && "selected"}>Url</Button>
                    <Button onClick={(ev) => onChangeSelection(ev, "file")}
                            type={!isUrl && "selected"}>File</Button>

                </div>

                {isUrl && (
                    <TextField value={state.url} placeholder={"Url"} name={"Url"} onChange={onChange}/>
                )}
                {!isUrl && (
                    <label htmlFor="file" title={"File"}>
                        <input onChange={onChange}
                               id="file"
                               type="file"/>
                    </label>
                )}
            </div>
            {renderAction({type: EActionTypes.okCancel, onSubmit: () => onSubmit(isUrl ? url : files), onCancel})}
        </div>
    )
}
