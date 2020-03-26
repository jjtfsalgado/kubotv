import * as React from "react";
import css from "./home.less"
import {HashRouter, Link, Route, Switch} from "react-router-dom";
import {SignUp} from "../register/signup";
import {Login} from "../login/login";
import {Privacy} from "../privacy/privacy";
import {Terms} from "../terms/terms";

export function HomeRouter () {
    return (
        <div className={css.home}>
            <header>
                <div className={css.content}>
                    <div className={css.logo}><Link to={"/"}>Logo</Link></div>

                    <div className={css.user}>
                        <Link to={"/login"}>Login</Link>
                        <Link to={"/register"}>Sign up</Link>
                    </div>
                </div>
            </header>
            <main>
                <HashRouter>
                    <Switch>
                        <Route path="/register" children={<SignUp/>}/>
                        <Route path="/login" children={<Login/>}/>
                        <Route path="/privacy" children={<Privacy/>}/>
                        <Route path="/terms" children={<Terms/>}/>
                        <Route path="/" children={<Home/>}/>
                    </Switch>
                </HashRouter>
            </main>
            <footer>
                <div className={css.content}>
                    <span>Copyright © 2020 | Plus  Net tv | All rights reserved.</span>

                    <div className={css.links}>
                        <Link to={"/privacy"}>Privacy policy</Link>
                        <Link to={"/terms"}>Terms of service</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export const Home = () => {
    return (
        <>
            <div className={css.intro}>
                <div className={css.content}>
                    <h4>+Net tv</h4>
                    <h1>Your tv, everywhere.</h1>

                    <div className={css.links}>
                        <Link to={"/register"}>Watch now</Link>
                        <a href={"#info"}>Learn more</a>
                    </div>
                </div>
            </div>
            <div id={"info"} className={css.info}>
                Info
            </div>
            <div className={css.demo}>
                Demo
            </div>
        </>
    )
};
