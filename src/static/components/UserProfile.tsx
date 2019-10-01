import * as React from "react";
import { ChangeEvent } from "react";
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
    // TODO: Change hacky method for setting user data
    this.state = {
      userData: this.props.appState.userData
    };
    this.handleChange = this.handleChange.bind(this)
    this.handleSave = this.handleSave.bind(this)
  }

  componentDidMount() {
    this.reload();
  }

  reload() {
    if (!this.state.userData) return;
    const email = this.state.userData.email;
    axios.get<ISingleUserResponse>("/api/users/current").then(data => {
      this.setState({ userData: data.data.user });
    });
  }

  // TODO: Add input validation
  handleChange = (key: string) => (event: ChangeEvent) => {
    if (!this.state.userData) return;
    const target = event.target as HTMLInputElement;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const email = this.state.userData.email;

    const newState = {
      userData: {
        ...this.state.userData,
        [key]: value
      }
    };

    this.setState(newState);
  };

  handleSave(event) {
    if (!this.state.userData) return;
    const email = this.state.userData.email;
    axios
      .put<ISingleUserResponse>(`/api/users/${encodeURIComponent(email)}`, {
        ...this.state.userData,
      })
      .then(result => {
        this.reload();
      });
  }

  render() {
    
    return this.state.userData ? (
      <div className="page user-profile-view mt-2">
        <div className="row align-items-center">
          <div className="col">
            <h1 className="mb-0"> Profile: WIP </h1>
          </div>
        </div>
        <div className="divider" />
          <Form className="mt-2">
            <div className="row">
              <div className="col">
                <FormGroup>
                  <Label for="major">Major</Label>
                  <Input 
                    type="text" 
                    name="major" 
                    id="major" 
                    placeholder="Please add major" 
                    value={this.state.userData.major} 
                    onChange={this.handleChange("major")}
                  />
                </FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input
                      type="checkbox"
                      id="pcp"
                      checked={this.state.userData.pcpMentor}
                      onChange={this.handleChange("pcpMentor")}
                    />{' '}
                    PCP Mentor
                  </Label>
                </FormGroup>
                <br />
                <FormGroup>
                  <Label for="preferredComm">Preferred Channel of Communication (For PCP Mentors)</Label>
                  <Input 
                    type="text" 
                    name="preferredComm" 
                    id="preferredComm" 
                    placeholder="Please add preferred mode of communication" 
                    value={this.state.userData.preferredChannel} 
                    onChange={this.handleChange("preferredChannel")} 
                  />
                </FormGroup>
                <br />
                <Button onClick={this.handleSave} color="success">Save</Button>
              </div>
            </div>
          </Form>
      </div>
    ) : (
      <h4 className="mt-2">Loading...</h4>
    );
  }
}

export default UserProfilePage;
