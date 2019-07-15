import * as React from "react";
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

class PCP extends React.Component<IUserViewProps, IUserViewState> {
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
    axios.get<IUserListResponse>("/api/users/pcp").then(data => {
      this.setState({ users: data.data.users });
    });
  }

  render() {
    const UserRow = (user: ISimpleUser, index: number) => (
      <tr key={index}>
        <td className="profile-img-col">
          <img className="img-fluid rounded profile-img" src={user.image} />
        </td>
        <td>{user.firstName}</td>
        <td>{user.lastName}</td>
        <td>{user.email}</td>
        <td>{user.preferredChannel}</td>
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
              <th>Preferred Communication</th>
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
            <h1 className="mb-0">Peer Counselling Platform</h1>
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

export default PCP;
