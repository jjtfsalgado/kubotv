import * as React from "react";

export const CheckSvg = (props: {color?: string, size?: number}) => {
    const {size, color} = props;

    return (
        <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox={`0 0 24 24`} width={size}>
            <path d="M0 0h24v24H0V0zm0 0h24v24H0V0z" fill={"none"}/>
            <path fill={color} d="M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
        </svg>
    )
};

CheckSvg.defaultProps = {
    size: 24
};


