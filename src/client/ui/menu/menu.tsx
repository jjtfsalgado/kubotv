import * as React from "react";
import {ReactNode, useLayoutEffect, useRef, useState} from "react";
import css from "./menu.less";
import {createPortal} from "react-dom";
import {getModalRoot} from "../dialog/dialog";
import {List} from "../list/list";


interface IMenuItemSeparator{
    type: "separator"
}

interface IMenuItemAction<T> {
    type: "action";
    description: (entry: T) => string;
    icon?: (entry: T) => string;
    onClick: (entry: T, ev) => void;
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
                const {onClick, description, icon} = item;
                return (
                    <span className={css.item} onClick={(ev) => onClick(entry, ev)}>
                        {icon && icon(entry)}
                        {description(entry)}
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
    xx: number;
    yy: number;
    visible: boolean;
}

const padding = 4;

export const ContextMenu = <T extends unknown>(props: IContextMenuProps<T>) => {
    const {eventType, items, children, entry} = props;
    const [state, setState] = useState<IContextMenuState>({visible: false} as any);
    const {visible, xx, yy} = state;
    const anchorRef = useRef(null);
    const portalRef = useRef(null);

    const handleEvent = (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        const bounds = anchorRef.current?.getBoundingClientRect();

        if(!bounds) return;
        const {x, y, height} = bounds;
        const xx = x;
        const yy = y + height + padding;

        setState({ visible: true, xx, yy});
    };

    const handleClick = (ev) => {
        const contains = portalRef?.current?.contains(ev.target);
        if(contains) return ev.stopPropagation();
        setState((prevState) => ({...prevState, visible: false}));
    };

    useLayoutEffect(() => {
        if(!anchorRef) return;
        const event = eventType || "contextmenu";
        anchorRef.current?.addEventListener(event, handleEvent, {capture: true});
        document.addEventListener("click", handleClick, {capture: true});

        const overlayRect = portalRef?.current?.getBoundingClientRect();
        const anchorRect = anchorRef.current?.getBoundingClientRect();

        if((overlayRect.top + overlayRect.height + padding) > window.innerHeight){
            const yy = overlayRect.top - overlayRect.height - anchorRect.height - padding * 2;
            setState(prevState => ({...prevState, yy}))
        }else if((overlayRect.left + overlayRect.width + padding) > window.innerWidth){
            const xx = overlayRect.left - overlayRect.width - anchorRect.width - padding * 2;
            setState(prevState => ({...prevState, xx}))
        }

        return () => {
            anchorRef.current?.removeEventListener(event, handleEvent, {capture: true});
            document.removeEventListener("click", handleClick, {capture: true});
        }
    }, [visible]);

    return (
        <>
            {children(anchorRef)}
            {createPortal(
                <div ref={portalRef} style={{position: "absolute", display: visible ? "unset" : "none", top: `${yy}px`, left: `${xx}px`}}>
                    <Menu items={items} entry={entry}/>
                </div>,
                getModalRoot()
            )}
        </>
    );
};
