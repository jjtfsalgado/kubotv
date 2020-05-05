
import * as React from "react";

export const PlusSvg = (props: {color?: string, size?: number}) => {
    const {size, color} = props;

    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox={`0 0 ${size} ${size}`} width={size}><path d="M0 0h24v24H0V0z" fill="none"/><path fill={color} d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
    )
};

PlusSvg.defaultProps = {
    size: 24
};




