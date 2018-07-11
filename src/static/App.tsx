import React from "react";
import axios from "axios";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { HomePage } from "./components/Home";
import { IUser, User } from "../models/User";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import SotongGuidePage from "./components/SotongGuide";

export interface IAppState {
    userData?: IUser;
}

export interface IRequiresAppState {
    appState: IAppState;
}

const initialAppState: IAppState = {
    userData: undefined
};

class App extends React.Component<undefined, Readonly<IAppState>> {
    constructor(props) {
        super(props);
        this.state = initialAppState;
    }

    componentWillMount() {
        axios.get<{ user: IUser }>("/api/users/current")
        .then(res => {
            this.setState({
                userData: res.data.user
            });
        })
        .catch(err => {
            console.log(err);
        });
    }

    render() {
        const GreetOrSignIn = () => {
            const userData = this.state.userData;
            if (userData) {
                return (
                <div>
                    <p>Hello {userData.firstName}</p>
                    <img src={userData.image} />
                </div>);
            } else {
                return <a href="/auth/facebook">Sign in</a>;
            }
        };

        return (
            <BrowserRouter>
                <div className="app">
                    <Navbar appState={this.state} />
                    <div className="container">
                            {/* <Sidebar /> */}
                            <main role="main">
                                {/* <GreetOrSignIn /> */}
                                <Switch>
                                    <Route component={SotongGuidePage} path="/guide"/>
                                    <Route component={HomePage} path="/"/>
                                </Switch>
                            </main>
                    </div>
                    <Footer />
                </div>
            </BrowserRouter>
        );
    }
}

export default App;