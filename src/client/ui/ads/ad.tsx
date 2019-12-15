import * as React from "react";
import {cls} from "../../../utils/function";
import {CSSProperties} from "react";

declare global {
    interface Window { adsbygoogle: any; }
}

export class Ad extends React.Component<{
    slot: string;
    client: string;
    style: Partial<CSSProperties>;
    className?: any;
},{}>{
    componentDidMount () {
        if(window) (window.adsbygoogle = window.adsbygoogle || []).push({
            google_ad_client: "ca-pub-9406837176504492",
            enable_page_level_ads: true
        });
    }

    render () {
        const {slot, client, style, className} = this.props;

        return (
            <ins className={cls("adsbygoogle", className)}
                style={style}
                 data-adtest={"on"}
                data-ad-client={client}
                data-ad-slot={slot} />
        );
    }
}