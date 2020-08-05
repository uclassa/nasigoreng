import React, { CSSProperties, StatelessComponent } from "react";
import { Link } from "react-router-dom";
import coverImg from "../assets/cover.jpg";
import squidImg from "../assets/squid.png";
import oldManImg from "../assets/oldman.png";
import phoneImg from "../assets/phone.png";

import { PromiseProvider } from "mongoose";

export const HomePage = () => {

    const backgroundImgStyle: CSSProperties = {
        backgroundImage: `url(${coverImg})`
    };

    interface IntroBlockProps {
        heading: string;
        icon: string;
    }

    const IntroBlock: StatelessComponent<IntroBlockProps> = (props) => (
        <div className="col-md-4">
            <div className="row">
                <div className="col-3 col-sm-12">
                    <img className="d-icon mx-auto d-block" src={props.icon}></img>
                </div>
                <div className="col">
                    <h3 className="pt-2">{props.heading}</h3>
                </div>
            </div>
            <div className="row mt-1">
                <p className="col px-4">
                    {props.children}
                </p>
            </div>
        </div>
    );

    return (
        <div className="homepage">
            <div className="row">
                <div className="hero angle--bottom-right" style={backgroundImgStyle}></div>
            </div>
            <div className="row mt-3">
                <div className="col title">
                    <h2>UCLA</h2>
                    <h1>Singaporean Students Association</h1>
                    <h5>Your home to all things Singaporean at UCLA!</h5>
                </div>
            </div>
            <div className="divider" />
            <div className="row mt-4 directions">
                <IntroBlock heading="New to UCLA" icon={squidImg}>
                    <p>Get oriented with our <Link to="/guide">Sotong Guide</Link> for incoming freshmen and <a href="/auth/facebook">sign up</a> for
                    an account to get access to our resources!</p>
                    <p>
                      Be sure to
                    join our <a target="_blank" href="https://www.facebook.com/groups/122880215014668/">SSA Facebook group</a>, <a target="_blank" href="https://mailchi.mp/868c856a80ab/join-our-ssa-mailing-list">Slack channel</a>,
                    and subscribe to our <a target="_blank" href="https://join.slack.com/t/ucla-ssa/shared_invite/zt-g5x25pck-VItLLzkMewtmOcEy0TPwlA">newsletter</a>!
                    </p>
                </IntroBlock>
                <IntroBlock heading="Members/Alumni" icon={oldManImg}>
                    <em>We're still working on this! Let us know if you want any features!</em>
                </IntroBlock>
                <IntroBlock heading="Contact Us" icon={phoneImg}>
                    We're always looking for sponsorship and career opportunities! You can reach us <a href="mailto:exco@uclassa.org">via email</a> or
                    simply drop any of us a message on Facebook!
                </IntroBlock>
            </div>
        </div>
    );
};
