import * as React from "react";

export const MenuSvg = (props: {color?: string, size?: number, style?}) => {
    const {size, color, style} = props;

    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox={`0 0 24 24`} width={size} style={style}>
            <path d="M0 0h24v24H0z" fill="none"/>
            <path fill={color} d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
    )
};

MenuSvg.defaultProps = {
    size: 24
};



