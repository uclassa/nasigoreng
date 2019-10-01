import * as React from "react";
import axios from "axios";
import { Table, Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { ISimpleUser } from "../../models/User";
import { IAppState } from "../App";
import {
  IUserListResponse,
  ISingleUserResponse
} from "../../controllers/userController";

interface IUserProfileProps {
  appState: IAppState;
}

interface IUserProfileState {
  userData: ISimpleUser;
}

class UserProfilePage extends React.Component<IUserProfileProps, IUserProfileState> {
  constructor(props) {
    super(props);
    this.state = {
      userData: this.props.appState.userData
    };
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.reload();
  }

  reload() {
    this.setState({ userData: this.props.appState.userData });
  }

  handleChange(event) {
    console.log("Handing some changes");
    console.log(event)
    if (!this.state.userData) return;
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    const email = this.state.userData.email;

    axios
      .put<ISingleUserResponse>(`/api/users/${encodeURIComponent(email)}`, {
        ...this.state.userData,
        pcpMentor: value
      })
      .then(result => {
        this.state.userData.pcpMentor = value;
        this.reload();
      });
  }

  render() {

    const UserProfile = () => {
      return this.state.userData ? (
        <Form className="mt-2">
          <div className="row">
            <div className="col">
              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    id="pcp"
                    checked={this.state.userData.pcpMentor}
                    onChange={this.handleChange}
                  />{' '}
                  PCP Mentor
                </Label>
              </FormGroup>
            </div>
          </div>
        </Form>
      ) : (
        <h4 className="mt-2">Loading...</h4>
      );

    }

    return (
      <div className="page user-profile-view mt-2">
        <div className="row align-items-center">
          <div className="col">
            <h1 className="mb-0"> Profile: WIP </h1>
          </div>
        </div>
        <div className="divider" />
        <UserProfile />
      </div>
    );
  }
}

export default UserProfilePage;
