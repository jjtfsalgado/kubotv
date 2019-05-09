import * as React from 'react';
import css from "./app.less";
import {Video} from "./video";
import {ChannelList} from "./channel_list";


export class App extends React.Component<{},{}>{
    render() {
        return (
            <div className={css.app}>
                <div className={css.containerVideo}>
                    <Video showControls={true}/>
                </div>
                <div className={css.containerChannel}>
                    <ChannelList />
                </div>
            </div>
        )
    }
}





