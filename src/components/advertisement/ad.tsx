import * as React from "react";

export class Ad extends React.Component<{
    slot: string;
    client: string;
    style: Partial<CSSStyleDeclaration>
},{}>{
    componentDidMount () {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    }

    render () {
        const {slot, client, style} = this.props;

        return (
            <ins className="adsbygoogle"
                style={style}
                data-ad-client={client}
                data-ad-slot={slot} />
        );
    }
}