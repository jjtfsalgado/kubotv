import * as React from 'react';
import css from "./app.less";
import {Video} from "./video";


export class App extends React.Component<{},{}>{
    render() {
        return (
            <div className={css.app}>
                <h1>Hello from React and Typescrit!</h1>
                <Video />
            </div>
        )
    }
}





