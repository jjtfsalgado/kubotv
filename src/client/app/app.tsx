import * as React from 'react';
import {useEffect, useState} from 'react';
import {HashRouter, Redirect, Route, Switch} from "react-router-dom";
import {Player} from "./player/player";
import {Home} from "./home/home";
import {Login} from "./login/login";
import css from "./app.less";
import {SignUp} from "./register/signup";
import localStorageCtrl from "../controllers/localhost";
import axios from "axios";
import {_HEADER_AUTH_} from "../../../global";

export function App() {
    useEffect(() => {
        axios.defaults.headers.common[_HEADER_AUTH_] = localStorageCtrl.tokenGet;
    },[]);

    return (
        <div className={css.app}>
            <HashRouter>
                <Switch>
                    <PrivateRoute path="/player" children={<Player/>}/>
                    <Route path="/register" children={<SignUp/>}/>
                    <Route path="/login" children={<Login/>}/>
                    <Route path="/" children={<Home/>}/>
                </Switch>
            </HashRouter>
        </div>
    )
};


async function verifyToken(token: string): Promise<boolean>{
    const response = await axios.post(`/verify/${token}`);
    return response.data
};

function PrivateRoute({ children, ...rest }) {
    const [isAuthenticated, setAuthentication] = useState(null);

    useEffect( () => {
        (async () => {
            const token = localStorageCtrl.tokenGet;
            const isVerified = await verifyToken(token);
            setAuthentication(isVerified);
        })()
    }, []);

    if(isAuthenticated == null) return <p>Loading...</p>;

    return (
        isAuthenticated ? <Route {...rest}>{children}</Route> : <Redirect to={{pathname: "/login"}}/>
    );
}




