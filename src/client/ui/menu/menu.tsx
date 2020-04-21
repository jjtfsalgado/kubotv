import * as React from "react";
import {ReactNode, useEffect, useRef, useState} from "react";
import css from "./menu.less";
import {createPortal} from "react-dom";
import {getModalRoot} from "../dialog/dialog";
import {List} from "../list/list";


interface IMenuItemSeparator{
    type: "separator"
}

interface IMenuItemAction {
    description: string;
    icon?: string;
    type: "action"
}

export type IMenuItem = IMenuItemAction | IMenuItemSeparator;

interface IMenuProps {
    items: Array<IMenuItem>
}

const Menu = (props: IMenuProps) => {
    const {items} = props;

    const renderItem = (item: IMenuItem) => {
        switch (item.type) {
            case "action": {
                return (
                    <span className={css.item}>
                        {item.icon}
                        {item.description}
                    </span>
                )
            } case "separator": {
                return <br/>
            }
        }
    };

    return (
        <List className={css.menu}
              data={items}
              itemRender={renderItem}/>
    )
};


interface IContextMenuProps extends IMenuProps{
    eventType?: string; //default is 'contextmenu';
    children: (ref) => ReactNode;
}

interface IContextMenuState {
    x: number;
    y: number;
    visible: boolean;
}

export const ContextMenu = (props: IContextMenuProps) => {
    const {eventType, items, children} = props;
    const [state, setState] = useState<IContextMenuState>({visible: false} as any);
    const {visible, x, y} = state;
    const anchorRef = useRef(null);

    const handleEvent = (ev) => {
        console.log(ev, anchorRef.current);
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
                <div style={{position: "absolute", display: visible ? "unset" : "none", top: `${y}px`, left: `${x}px`}}>
                    <Menu items={items}/>
                </div>,
                getModalRoot()
            )}
        </>
    );
};
