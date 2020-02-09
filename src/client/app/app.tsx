import * as React from 'react';
import {useEffect, useState} from 'react';
import {BrowserRouter, Redirect, Route, Switch, useHistory} from "react-router-dom";
import {Player} from "./player/player";
import {Home} from "./home/home";
import {Login} from "./login/login";
import css from "./app.less";
import {SignUp} from "./register/signup";
import localStorageCtrl from "../controllers/localhost";
import axios from "axios";


export function App() {
    return (
        <div className={css.app}>
            <BrowserRouter>
                <Switch>
                    <PrivateRoute path="/player" children={<Player/>}/>
                    <Route path="/register" children={<SignUp/>}/>
                    <Route path="/login" children={<Login/>}/>
                    <Route path="/" children={<Home/>}/>
                </Switch>
            </BrowserRouter>
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
            setAuthentication(token ? await verifyToken(token) : false);
        })()
    }, []);

    if(isAuthenticated == null) return <p>Loading...</p>;

    return (
        isAuthenticated ? <Route {...rest}>{children}</Route> : <Redirect to={{pathname: "/login"}}/>
    );
}




