import * as React from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {Player} from "./player/player";
import {Home} from "./home/home";
import {Login} from "./login/login";
import css from "./app.less";
import {SignUp} from "./register/signup";

export function App() {
    return (
        <div className={css.app}>
            <BrowserRouter>
                <Switch>
                    <Route path="/player">
                        <Player/>
                    </Route>
                    <Route path="/register">
                        <SignUp/>
                    </Route>
                    <Route path="/login">
                        <Login/>
                    </Route>
                    <Route path="/">
                        <Home/>
                    </Route>
                </Switch>
            </BrowserRouter>
        </div>
    )
};





