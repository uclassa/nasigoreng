import mongoose from "mongoose";
import { Schema } from "mongoose";
import { IUserModel, IUser } from "./User";

interface ISimpleTestBankFile {
  id: string;
  name: string;
  department: string;
  courseNumber: string;
  gcpName: string;
  quarter: string;
  year: string;
  professor: string;
  filetype: string;
}

interface ITestBankFile extends ISimpleTestBankFile {
  uploadedBy: IUser;
  uploadedOn: Date;
}

interface ITestBankFileModel extends ITestBankFile, mongoose.Document {}

export const ValidQuarters = ["Summer", "Fall", "Winter", "Spring", "N/A"];

export const ValidFiletype = ["Midterm", "Final", "Notes", "Others"];

const TestBankFileSchema = new Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  year: {
    type: String,
    validate: {
      validator: function(v: string) {
        if (v.length != 4) return false;
        if (parseInt(v) > 2500 || parseInt(v) < 2000) return false;
        return true;
      }
    }
  },
  gcpName: { type: String, unique: true },
  quarter: {
    type: String,
    enum: ValidQuarters
  },
  courseNumber: {
    type: String,
    validate: {
      validator: function(v: string) {
        if (v.length > 5) return false;
        return /^[a-zA-Z]?\d{1,3}[a-zA-Z]?$/.test(v);
      }
    }
  },
  filetype: {
    type: String,
    enum: ValidFiletype
  },
  professor: { type: String, required: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
  uploadedOn: Date
});

const TestBankFile = mongoose.model<ITestBankFileModel>(
  "TestBankFile",
  TestBankFileSchema
);

const testBankToSimpleTestBank = (v: ITestBankFileModel) =>
  ({
    id: v.id,
    name: v.name,
    department: v.department,
    courseNumber: v.courseNumber,
    gcpName: v.gcpName,
    quarter: v.quarter,
    year: v.year,
    professor: v.professor,
    filetype: v.filetype
  } as ISimpleTestBankFile);

export {
  TestBankFile,
  ISimpleTestBankFile,
  ITestBankFile,
  testBankToSimpleTestBank
};
