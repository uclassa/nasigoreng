import { Request, Response, NextFunction } from "express";
import {
  TestBankFile,
  testBankToSimpleTestBank,
  ISimpleTestBankFile
} from "../models/TestBankFile";
import { Storage } from "@google-cloud/storage";
import Config from "../config";
import { ValidationError } from "../errors/Errors";

const gcpStorage = new Storage({
  projectId: Config.GCP_PROJECT_ID
});
const testBankBucket = gcpStorage.bucket(Config.GCP_BUCKET_ID);

export interface ITestBankSingleResponse {
  data: ISimpleTestBankFile;
  signedDownloadUrl: string;
}

export interface ITestBankListResponse {
  files: ISimpleTestBankFile[];
}

export interface ICreateSignedUploadURLResponse {
  signedUploadUrl: string;
  fileName: string;
}

export const getOneTestbankFile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  if (!id) {
    next(new ValidationError());
  } else {
    TestBankFile.findById(id)
      .then(tb => {
        const file = testBankBucket.file(tb.gcpName);
        const expiration = Date.now() + 300000; // 5 minutes
        return Promise.all([
          file.getSignedUrl({
            expires: expiration,
            action: "read"
          }),
          tb
        ]);
      })
      .then(([signedUrl, tbf]) => {
        res.json({
          signedDownloadUrl: signedUrl[0],
          data: tbf
        } as ITestBankSingleResponse);
      });
  }
};

export const createSignedUpload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const payload = new TestBankFile(req.body);

  const fname = `${payload.department}-${payload.courseNumber}_${
    payload.quarter
  }-${payload.year}_${payload.name}`;

  payload
    .validate()
    .catch(err => {
      next(new ValidationError(err));
    })
    .then(() => {
      const file = testBankBucket.file(fname);
      const expiration = Date.now() + 900000; // 15 minutes
      return file.getSignedUrl({
        expires: expiration,
        action: "write",
        contentType: req.body.fileType
      });
    })
    .then(data => {
      res.json({ signedUploadUrl: data[0], fileName: fname });
    });
};

export const createTestBank = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const payload = new TestBankFile(req.body);

  const fname = `${payload.department}-${payload.courseNumber}_${
    payload.quarter
  }-${payload.year}_${payload.name}`;

  payload
    .validate()
    .catch(err => {
      next(new ValidationError(err));
    })
    .then(() => {
      payload.uploadedBy = req.user;
      payload.gcpName = fname;
      payload.uploadedOn = new Date();
      return payload.save();
    })
    .then(d => {
      return res.json(d.toJSON());
    });
};
export const listTestBank = (req: Request, res: Response) => {
  TestBankFile.find({}).then(results => {
    const data = results.map(testBankToSimpleTestBank);

    res.json({
      files: data
    } as ITestBankListResponse);
  });
};
