import * as React from "react";
import {ReactNode, useEffect, useRef, useState} from "react";
import css from "./menu.less";
import {createPortal} from "react-dom";
import {getModalRoot} from "../dialog/dialog";
import {List} from "../list/list";


interface IMenuItemSeparator{
    type: "separator"
}

interface IMenuItemAction<T> {
    description: string;
    icon?: string;
    type: "action";
    onClick: (ev, item: T) => void;
}

export type IMenuItem<T> = IMenuItemAction<T> | IMenuItemSeparator;

interface IMenuProps<T> {
    items: Array<IMenuItem<T>>
    entry: T;
}

const Menu = <T extends unknown>(props: IMenuProps<T>) => {
    const {items, entry} = props;

    const renderItem = (item: IMenuItem<T>) => {
        switch (item.type) {
            case "action": {
                return (
                    <span className={css.item} onClick={(ev) => item.onClick(ev, entry)}>
                        {item.icon}
                        {item.description}
                    </span>
                )
            } case "separator": {
                return <hr style={{flex: 1}}/>
            }
        }
    };

    return (
        <List className={css.menu}
              data={items}
              itemRender={renderItem}/>
    )
};


interface IContextMenuProps<T> extends IMenuProps<T>{
    eventType?: string; //default is 'contextmenu';
    children: (ref) => ReactNode;
}

interface IContextMenuState {
    x: number;
    y: number;
    visible: boolean;
}

export const ContextMenu = <T extends unknown>(props: IContextMenuProps<T>) => {
    const {eventType, items, children, entry} = props;
    const [state, setState] = useState<IContextMenuState>({visible: false} as any);
    const {visible, x, y} = state;
    const anchorRef = useRef(null);

    const handleEvent = (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        const bounds = anchorRef.current?.getBoundingClientRect();
        if(!bounds) return;
        const {x, y, height} = bounds;
        const xx = x;
        const yy = y + height;
        setState({ visible: true, x: xx, y: yy});
    };

    useEffect(() => {
        if(!anchorRef) return;
        const event = eventType || "contextmenu";
        anchorRef.current?.addEventListener(event, handleEvent, {capture: true});
        return () => anchorRef.current?.removeEventListener(event, handleEvent, {capture: true});
    }, [anchorRef]);

    return (
        <>
            {children(anchorRef)}
            {createPortal(
                <div style={{position: "absolute", display: visible ? "unset" : "none", top: `${y}px`, left: `${x}px`}} onClick={(e) => e.stopPropagation()}>
                    <Menu items={items} entry={entry}/>
                </div>,
                getModalRoot()
            )}
        </>
    );
};
