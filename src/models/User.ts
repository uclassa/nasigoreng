import mongoose from "mongoose";

interface IUser extends ISimpleUser {
  fbUserId: string;
  fbToken: string;
}

interface ISimpleUser {
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  graduation: Date;
  major: string;
  image: string;
  preferredChannel: string;
  profession: string;
  company: string;
  admin: boolean;
  approved: boolean;
  pcpMentor: boolean;
  inAddressBook: boolean;
}

interface IUserModel extends IUser, mongoose.Document {}

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  fbUserId: String,
  fbToken: String,
  bio: String,
  graduation: Date,
  major: String,
  image: String,
  preferredChannel: String,
  admin: { type: Boolean, default: false },
  approved: { type: Boolean, default: false },
  pcpMentor: { type: Boolean, default: false }
});

const User = mongoose.model<IUserModel>("User", UserSchema);

const userToSimpleUser = (v: IUserModel) =>
  ({
    email: v.email,
    firstName: v.firstName,
    lastName: v.lastName,
    bio: v.bio,
    graduation: v.graduation,
    major: v.major,
    image: v.image,
    admin: v.admin,
    approved: v.approved,
    preferredChannel: v.preferredChannel,
    pcpMentor: v.pcpMentor
  } as ISimpleUser);

export { IUser, IUserModel, ISimpleUser, User, userToSimpleUser };
