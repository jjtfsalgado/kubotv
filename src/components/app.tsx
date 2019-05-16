import * as React from 'react';
import css from "./app.less";
import {Video} from "./video";
import {ChannelList} from "./channel_list";
import {Dialog} from "./ui/dialog";

class Test extends React.Component<{},{}>{
    render(){
        return <div>test</div>
    }
}



export class App extends React.Component<{},{}>{
    async componentDidMount(){
        const res = await Dialog.async(<Test/>, {title: "test", okText:"Ok"});
        console.log(res)
    }

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





