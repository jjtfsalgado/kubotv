import * as React from 'react';
import {useEffect, useState} from 'react';
import {HashRouter, Redirect, Route, Switch} from "react-router-dom";
import {Player} from "./player/player";
import {HomeRouter} from "./home/home";
import css from "./app.less";
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
                    <Route path="/" children={<HomeRouter/>}/>
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
            try{
                const token = localStorageCtrl.tokenGet;
                const isVerified = token ? await verifyToken(token) : false;
                setAuthentication(isVerified);
            }catch (e) {
                setAuthentication(false);
            }
        })()
    }, []);

    if(isAuthenticated == null) return <p>Loading...</p>;

    return (
        isAuthenticated ? <Route {...rest}>{children}</Route> : <Redirect to={{pathname: "/login"}}/>
    );
}




