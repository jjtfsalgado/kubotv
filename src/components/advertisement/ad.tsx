import * as React from "react";
import {cls} from "../../utils/function";

export class Ad extends React.Component<{
    slot: string;
    client: string;
    style: Partial<CSSStyleDeclaration>;
    className?: any;
},{}>{
    componentDidMount () {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    }

    render () {
        const {slot, client, style, className} = this.props;

        return (
            <ins className={cls("adsbygoogle", className)}
                style={style}
                data-ad-client={client}
                data-ad-slot={slot} />
        );
    }
}