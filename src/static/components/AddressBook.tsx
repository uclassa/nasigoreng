import * as React from "react";
import axios from "axios";
import { Card, Button, CardBody, CardText, CardTitle, CardImg, CardDeck } from "reactstrap";
import { ISimpleAddressBookEntry, AddressBookEntry } from "../../models/AddressBookEntry";
import { IAppState } from "../App";
import {
  IAddressBookResponse
} from "../../controllers/addressBookController";
import CardGroup from "reactstrap/lib/CardGroup";

interface IAddressViewProps {
  appState: IAppState;
}

interface IAddressViewState {
  addressBook?: Array<ISimpleAddressBookEntry>;
}

class AddressBook extends React.Component<IAddressViewProps, IAddressViewState> {
  constructor(props) {
    super(props);
    this.state = {
      addressBook: undefined
    };
  }

  componentDidMount() {
    this.reload();
  }

  reload() {
    axios.get<IAddressBookResponse>("/api/address_book").then(data => {
      this.setState({ addressBook: data.data.addressBook });
    });
  }

  render() {
    const AddressCard = (address: ISimpleAddressBookEntry, index: number) => (
      <Card key={index} className="text-center">
        <CardImg className="img-fluid rounded profile-img" src={address.image || "../assets/bear.png"} />
        <CardBody>
          <CardTitle>{address.name}</CardTitle>
          {address.graduation &&<CardText>{address.graduation}</CardText> }
          {address.email && <CardText>{address.email}</CardText> }
          {address.profession && <CardText>{address.profession}</CardText> }
          {address.company && <CardText>{address.company}</CardText> }
          {address.preferredChannel && <CardText>{address.preferredChannel}</CardText> }
        </CardBody>
      </Card>
      
    );

    const AddressCards = () => {
      return this.state.addressBook ? (
        <CardGroup body>
          {this.state.addressBook.map((u, i) => AddressCard(u, i))}
        </CardGroup>
      ) : (
        <h4 className="mt-2">Loading...</h4>
      );
    };

    return (
      <div className="page user-card-view mt-2">
        <div className="row align-items-center">
          <div className="col">
            <h1 className="mb-0">Address Book</h1>
          </div>
        </div>
        <div className="divider" />
        <div className="row">
          <div className="col">
            <AddressCards />
          </div>
        </div>
      </div>
    );
  }
}

export default AddressBook;
