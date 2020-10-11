import mongoose from "mongoose";
import { Schema } from "mongoose";

interface ISimpleAddressBookEntry {
  name: string;
  image: string;
  graduation: Date;
  email: string;
  profession: string;
  company: string;
  preferredChannel: string;
}

interface IAddressBookEntry extends ISimpleAddressBookEntry {
  submittedOn: Date;
}

interface IAddressBookEntryModel extends IAddressBookEntry, mongoose.Document {}

const AddressBookEntrySchema = new Schema({
  name: { type: String, required: true },
  image: String,
  graduation: Date,
  email: String,
  profession: String,
  company: String ,
  preferredChannel: String,
  submittedOn: Date
});

const AddressBookEntry = mongoose.model<IAddressBookEntryModel>(
  "AddressBookEntry",
  AddressBookEntrySchema
);

const addressBookToSimpleAddressBook = (v: IAddressBookEntryModel) =>
  ({
    name: v.name,
    image: v.image,
    graduation: v.graduation,
    email: v.email,
    profession: v.profession,
    company: v.company,
    preferredChannel: v.preferredChannel
  } as ISimpleAddressBookEntry);

export {
  AddressBookEntry,
  ISimpleAddressBookEntry,
  IAddressBookEntryModel,
  addressBookToSimpleAddressBook
};
