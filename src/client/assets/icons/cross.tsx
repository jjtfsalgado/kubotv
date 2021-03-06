import * as React from "react";

export const CrossSvg = (props: {color?: string, size?: number}) => {
    const {size, color} = props;

    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox={`0 0 24 24`} width={size} >
            <path fill={color} d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
    )
};

CrossSvg.defaultProps = {
    size: 24
};



