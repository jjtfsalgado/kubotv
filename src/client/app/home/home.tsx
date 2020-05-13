import * as React from "react";
import css from "./home.less"
import {HashRouter, Link, Route, Switch, useLocation} from "react-router-dom";
import {Register} from "../register/register";
import {Login} from "../login/login";
import {Privacy} from "../privacy/privacy";
import {Terms} from "../terms/terms";
import {useEffect, useRef} from "react";

import Logo from '../../assets/icons/logo.png';
import Favourites from '../../assets/favourites.png';
import Playlist from '../../assets/playlist.png';
import Intro from '../../assets/intro.png';

import {Button} from "../../ui/button/button";
import {createPortal} from "react-dom";
import {cls} from "../../../utils/function";

export function HomeRouter () {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className={css.home}>
            <header>
                <div className={css.content}>
                    <div className={css.logo}>
                        <Link to={"/"}>
                            <img alt={"logo"} src={Logo} style={{width: 28}}/><span>Kubo tv</span>
                        </Link>
                    </div>

                    <div className={css.user}>
                        <Link to={"/login"}><Button onClick={() => null} type={pathname === "/login" && "selected"}>Login</Button></Link>
                        <Link to={"/register"}><Button onClick={() => null} type={pathname === "/register" && "selected"}>Sign up</Button></Link>
                    </div>
                </div>
            </header>
            <main>
                <HashRouter>
                    <Switch>
                        <Route path="/privacy" children={<Privacy/>}/>
                        <Route path="/terms" children={<Terms/>}/>
                        <Route path="/register" children={<Register/>}/>
                        <Route path="/login" children={<Login/>}/>
                        <Route path="/" children={<Home/>}/>
                    </Switch>
                </HashRouter>
            </main>
            <footer>
                <div className={css.content}>
                    <span>Copyright © 2020 | KuboTV | All rights reserved</span>

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
    const infoRef = useRef(null);
    const demoRef = useRef(null);
    const demo2Ref = useRef(null);
    const demo3Ref = useRef(null);


    useEffect(() => {
        const image = document.getElementById("image") as HTMLImageElement;

        const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
            const visible: IntersectionObserverEntry = entries.find(i => i.intersectionRatio > 0.7);

            if(!visible) return;
            const id = visible?.target?.id;

            if(id === "one"){
                image.src = Intro;
            }else if(id === "two"){
                image.src = Favourites;
            }else if(id === "three"){
                image.src = Playlist;
            }
        }, {
            threshold: [0, 0.25, 0.5, 0.75, 1],
        });

        observer.observe(demoRef.current);
        observer.observe(demo2Ref.current);
        observer.observe(demo3Ref.current);
    }, []);


    const onLearnMore = (ev) => {
        infoRef?.current?.scrollIntoView({behavior: "smooth", block: "center"});
    };

    return (
        <>
            <section className={css.intro}>
                <div className={css.content}>
                    <h4>kubo TV</h4>
                    <h1>Your tv, everywhere.</h1>

                    <div className={css.links}>
                        <Link to={"/register"}>Watch now</Link>
                        <Button onClick={onLearnMore} type={"transparent"}>Learn more</Button>
                    </div>
                </div>
            </section>
            <section className={css.image}>
                <img alt={"info"} src={Intro}/>
            </section>
            <section className={css.info} >
                <p ref={infoRef}>
                    Watch for free live IPTV streams, anywhere. Add your favourite M3U playlists and watch them, anywhere. Your phone, your tv and your pc.
                    There's no limits at kuboTV, you can aggregate your favourite playlists in just one place, customize your channels and save your favourites!
                </p>
            </section>
            <section className={css.demos} >
                <div className={css.container}>
                    <div className={css.demo}>
                        <p ref={demoRef} id={"one"}>
                            Watch for free live IPTV streams, anywhere. Add your favourite M3U playlists and watch them, anywhere. Your phone, your tv and your pc.
                            There's no limits at kuboTV, you can aggregate your favourite playlists in just one place, customize your channels and save your favourites!
                        </p>
                    </div>
                    <div className={css.demo}>
                        <p ref={demo2Ref} id={"two"}>
                            Watch for free live IPTV streams, anywhere. Add your favourite M3U playlists and watch them, anywhere. Your phone, your tv and your pc.
                            There's no limits at kuboTV, you can aggregate your favourite playlists in just one place, customize your channels and save your favourites!
                        </p>
                    </div>
                    <div className={css.demo}>
                        <p ref={demo3Ref} id={"three"}>
                            Watch for free live IPTV streams, anywhere. Add your favourite M3U playlists and watch them, anywhere. Your phone, your tv and your pc.
                            There's no limits at kuboTV, you can aggregate your favourite playlists in just one place, customize your channels and save your favourites!
                        </p>
                    </div>
                </div>
                <div className={css.view}>
                    <img src={Intro} id={"image"} alt={"section1"} className={css.section}/>
                </div>
            </section>
        </>
    )
};
