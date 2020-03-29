import {List} from "../../../ui/list/list";
import * as React from "react";
import {useState} from "react";
import {IChannel} from "../../../controllers/hls";
import {Checkbox, DialogContent} from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import {EActionTypes, renderAction} from "../../../ui/dialog/dialog.action";
import ListItem from "@material-ui/core/ListItem";

interface ISelectPlaylistDialog {
    data: Array<IChannel>
}

export async function showSelectPlaylistDialog(props: ISelectPlaylistDialog): Promise<Array<IChannel> | false> {
    const {data} = props;

    // return showDialog<Array<IChannel> | false>({title: "Select playlist", children: (onSubmit, onCancel) => <SelectPlaylist onSubmit={onSubmit} onCancel={onCancel} data={data}/>});

    return null
}

function SelectPlaylist(props) {
    const {data, onSubmit, onCancel} = props;
    const [state, setState] = useState({selectedItems: new Set([])});
    const {selectedItems} = state;

    function itemRender(item) {
        return (
            <ListItem>
                <Checkbox
                    checked={selectedItems.has(item)}
                    tabIndex={-1}
                    disableRipple
                />
                <ListItemText primary={item.description}/>
            </ListItem>
        )
    }

    function onItemClick(item){
        selectedItems.has(item) ? selectedItems.delete(item) : selectedItems.add(item);
        setState({selectedItems: new Set(Array.from(state.selectedItems))})
    }

    return (
        <>
            <List data={data} itemRender={itemRender} onItemClick={onItemClick}/>
            {renderAction({type: EActionTypes.okCancel, onSubmit: () => onSubmit(Array.from(selectedItems)), onCancel})}
        </>
    )
}
