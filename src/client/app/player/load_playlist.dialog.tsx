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
    description: string;
};

export function LoadPlaylist(props : {onSubmit: (value: {data: string | FileList, description: string}) => void, onCancel: () => void}){
    const {onSubmit, onCancel} = props;

    const [state, setState] = useState<ILoadPlaylistState>({url:null, files: null, isUrl: true, description: null});
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

    const onChangeDescription = (ev) => {
        setState({...state, description: ev?.target?.value});
    }

    return (
        <div className={css.load}>
            <div className={css.body}>
                <span className={css.text}>Type an URL or upload your playlist (M3U)</span>

                <div className={css.buttons}>
                    <Button onClick={(ev) => onChangeSelection(ev, "url")}
                            type={isUrl && "selected"} text={"Url"}/>
                    <Button onClick={(ev) => onChangeSelection(ev, "file")}
                            type={!isUrl && "selected"} text={"File"}/>

                </div>

                <TextField required={true} value={state.description} placeholder={"Description"} name={"Description"} onChange={onChangeDescription}/>

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
            {renderAction({type: EActionTypes.okCancel, onSubmit: () => onSubmit({description: state.description, data: isUrl ? url : files}), onCancel})}
        </div>
    )
}
