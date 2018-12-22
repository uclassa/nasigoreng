import React from "react";
import axios from "axios";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { HomePage } from "./components/Home";
import { IUser, User } from "../models/User";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import SotongGuidePage from "./components/SotongGuide";
import UserViewPage from "./components/UserView";
import TestBank from "./components/TestBank";

interface IAppState {
  userData?: IUser;
}

interface IRequiresAppState {
  appState: IAppState;
}

const initialAppState: IAppState = {
  userData: undefined
};

class App extends React.Component<{}, Readonly<IAppState>> {
  constructor(props) {
    super(props);
    this.state = initialAppState;
  }

  componentWillMount() {
    axios
      .get<{ user: IUser }>("/api/users/current")
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
          </div>
        );
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
                <Route
                  render={() => <SotongGuidePage appState={this.state} />}
                  path="/guide"
                />
                <Route
                  render={() => <UserViewPage appState={this.state} />}
                  path="/users"
                />
                <Route
                  render={() => <TestBank appState={this.state} />}
                  path="/testbank"
                />
                <Route component={HomePage} path="/" />
              </Switch>
            </main>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    );
  }
}

export { IAppState, IRequiresAppState, App };
