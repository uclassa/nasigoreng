import React from "react";
import axios from "axios";
import { Table, Button } from "reactstrap";
import { ISimpleUser } from "../../models/User";
import { IAppState } from "../App";
import {
  IUserListResponse,
  ISingleUserResponse
} from "../../controllers/userController";

interface IUserViewProps {
  appState: IAppState;
}

interface IUserViewState {
  users?: Array<ISimpleUser>;
}

class UserViewPage extends React.Component<IUserViewProps, IUserViewState> {
  constructor(props) {
    super(props);
    this.state = {
      users: undefined
    };
  }

  componentDidMount() {
    this.reload();
  }

  reload() {
    axios.get<IUserListResponse>("/api/users").then(data => {
      this.setState({ users: data.data.users });
    });
  }

  handleApproveClick = (index: number, email: string) => () => {
    if (!this.state.users) return;
    if (this.state.users[index].email == email) {
      axios
        .put<ISingleUserResponse>(`/api/users/${encodeURIComponent(email)}`, {
          ...this.state.users[index],
          approved: true
        })
        .then(result => {
          this.reload();
        });
    }
  };

  handleMakeAdmin = (index: number, email: string) => () => {
    if (!this.state.users) return;
    if (!window.confirm("Are you sure?")) return;
    if (this.state.users[index].email == email) {
      axios
        .put<ISingleUserResponse>(`/api/users/${encodeURIComponent(email)}`, {
          ...this.state.users[index],
          admin: true
        })
        .then(result => {
          this.reload();
        });
    }
  };

  render() {
    const UserRow = (user: ISimpleUser, index: number) => (
      <tr key={index}>
        <td className="profile-img-col">
          <img className="img-fluid rounded profile-img" src={user.image} />
        </td>
        <td>{user.firstName}</td>
        <td>{user.lastName}</td>
        <td>{user.email}</td>
        <td>
          {!user.approved ? (
            <Button onClick={this.handleApproveClick(index, user.email)}>
              Approve
            </Button>
          ) : (
            undefined
          )}

          {!user.admin ? (
            <Button
              color="danger"
              className="ml-1"
              onClick={this.handleMakeAdmin(index, user.email)}
            >
              Make Admin
            </Button>
          ) : (
            undefined
          )}
        </td>
      </tr>
    );

    const UserTables = () => {
      return this.state.users ? (
        <Table className="mt-2" borderless hover>
          <thead>
            <tr>
              <th />
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th />
            </tr>
          </thead>
          <tbody>{this.state.users.map((u, i) => UserRow(u, i))}</tbody>
        </Table>
      ) : (
        <h4 className="mt-2">Loading...</h4>
      );
    };

    return (
      <div className="page user-list-view mt-2">
        <div className="row align-items-center">
          <div className="col">
            <h1 className="mb-0">Members</h1>
          </div>
        </div>
        <div className="divider" />
        <div className="row">
          <div className="col">
            <UserTables />
          </div>
        </div>
      </div>
    );
  }
}

export default UserViewPage;
