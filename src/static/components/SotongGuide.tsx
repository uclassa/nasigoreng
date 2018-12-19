import React from "react";
import { IAppState } from "../App";
import axios from "axios";
import sotongImg from "../assets/squid.png";
import { IGuideResponse } from "../../controllers/contentController";
interface ISGState {
    markdown?: string;
    editLink?: string;
    html?: string;
    toc?: string;
    fetchTime: Date;
}

const initialSGState: ISGState = {
    markdown: undefined,
    editLink: undefined,
    html: undefined,
    toc: undefined,
    fetchTime: undefined
};

class SotongGuidePage extends React.Component<{ appState: IAppState }, ISGState> {
    constructor(props) {
        super(props);
        this.state = initialSGState;
        this.refreshGuide = this.refreshGuide.bind(this);
    }

    componentWillMount() {
        this.refreshGuide();
    }

    refreshGuide(force: Boolean = false) {
        axios.get<IGuideResponse>("/api/guide" + (force ? "?force=true" : ""))
        .then(data => {
            this.setState({
                markdown: data.data.md,
                html: data.data.html,
                editLink: data.data.editLink,
                toc: data.data.toc,
                fetchTime: data.data.fetchTime
            });
        });
    }

    render() {
        return(
            <div className="sotong-guide page mt-2">
                <div className="row align-items-center">
                    <div className="col d-flex">
                        <img className="sotong mr-2 hidden-xs-down" src={sotongImg} />
                        <h1 className="mb-0">The Sotong Guide</h1>
                    </div>
                </div>
                <div className="divider" />
                <div className="row">
                    <div className="col">
                        <small className="text-muted">
                            Help make this guide better! { this.state.editLink ?
                                <a href={this.state.editLink} target="_blank">Edit the guide.</a> :
                                <a href="/auth/facebook">Sign In</a>
                            }
                            {this.state.fetchTime ? ` | Last updated: ${this.state.fetchTime.toString()} | ` : ""}
                            {this.props.appState.userData && this.props.appState.userData.admin ? <a href="#" onClick={() => this.refreshGuide(true)}>Refresh</a> : ""}
                        </small>
                    </div>
                </div>
                <div className="row mt-4">
                    { !this.state.markdown && <h3 className="pl-4">Loading...</h3> }
                    <div className="col-md-3 toc" dangerouslySetInnerHTML={{ __html: this.state.toc }}>
                    </div>
                    <div className="col-md-9" dangerouslySetInnerHTML={{ __html: this.state.html}}>
                    </div>
                </div>
            </div>
        );
    }
}

export default SotongGuidePage;