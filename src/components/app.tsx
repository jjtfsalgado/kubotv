import * as React from 'react';
import css from "./app.less";
// import Hls from "../../dist/index";


export class App extends React.Component<{},{}>{
    render() {
        document

        //@ts-ignore
        if(window.Hls){
            console.log("hello hls.js!");

        }
        // if (Hls.isSupported()) {
        // }




        return (
            <div className={css.app}>
                <h1>Hello from React and Typescrit!</h1>
            </div>
        )
    }
}





