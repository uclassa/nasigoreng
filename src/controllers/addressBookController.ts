import { Request, Response } from "express";
import { ISimpleAddressBookEntry, AddressBookEntry, addressBookToSimpleAddressBook } from "../models/AddressBookEntry";

export interface IAddressBookResponse{
    addressBook: Array<ISimpleAddressBookEntry>;
}

export const listAddressBook = (_: Request, res: Response) => {
    AddressBookEntry.find({}).then(entries => {
      const simpleEntries = entries.map(addressBookToSimpleAddressBook);
  
      res.json({
        addressBook: simpleEntries
      } as IAddressBookResponse);
    })
  }
  