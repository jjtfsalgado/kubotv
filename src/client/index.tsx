import * as React from 'react';
import {render} from 'react-dom';
import {App} from "./app/app";
import {Provider} from 'react-redux'
import {store} from "./reducers";
import {HashRouter} from "react-router-dom";


const renderLoad = () => {
    render(
        <Provider store={store}>
            <HashRouter>
                <App/>
            </HashRouter>
        </Provider>,
        document.getElementById('root')
    );
};

window.onload = renderLoad;


// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', function() {
//         navigator.serviceWorker.register('./sw.js').then(function(registration) {
//             // Registration was successful
//             console.log('ServiceWorker registration successful with scope: ', registration.scope);
//         }, function(err) {
//             // registration failed :(
//             console.log('ServiceWorker registration failed: ', err);
//         });
//     });
// }
