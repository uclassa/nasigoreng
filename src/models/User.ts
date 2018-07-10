import mongoose from "mongoose";

interface IUser {
    email: string;
    firstName: string;
    lastName: string;
    fbUserId: string;
    fbToken: string;
    bio: string;
    graduation: Date;
    major: string;
    image: string;
    admin: boolean;
    approved: boolean;
}

interface IUserModel extends IUser, mongoose.Document {}

const UserSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    firstName: String,
    lastName: String,
    fbUserId: String,
    fbToken: String,
    bio: String,
    graduation: Date,
    major: String,
    image: String,
    admin: {type: Boolean, default: false},
    approved: {type: Boolean, default: false}
});

const User = mongoose.model<IUserModel>("User", UserSchema);

export {IUser, IUserModel, User};