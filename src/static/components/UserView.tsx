import React from "react";
import axios from "axios";
import { Table } from "reactstrap";
import { ISimpleUser } from "../../models/User";
import { IUserListResponse } from "../../controllers/userController";


interface IUserViewState {
    users?: Array<ISimpleUser>;
}

class UserViewPage extends React.Component<{}, IUserViewState> {
    constructor(props) {
        super(props);
        this.state = {
            users: undefined
        };
    }

    componentDidMount() {
        axios.get<IUserListResponse>("/api/users")
        .then(data => {
            this.setState({ users: data.data.users });
            console.log(data.data);
        });
    }

    render() {

        const UserTables = () => (
            <Table className="mt-2" borderless hover>
                <tbody>
                <tr>
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                </tr>
                <tr>
                    <th scope="row">2</th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                </tr>
                <tr>
                    <th scope="row">3</th>
                    <td>Larry</td>
                    <td>the Bird</td>
                    <td>@twitter</td>
                </tr>
                </tbody>
            </Table >
        );


        return (
            <div className="page mt-2">
                <div className="row align-items-center">
                    <div className="col">
                        <h1>Users</h1>
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