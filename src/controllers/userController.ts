import { Request, Response, NextFunction } from "express";
import Config from "../config";
import { UnauthorizedError, APIError } from "../errors/Errors";
import { User, IUser, ISimpleUser, userToSimpleUser } from "../models/User";

interface ISetupQueryParams {
  key?: string;
  email?: string;
}

export interface IUserListResponse {
  users: Array<ISimpleUser>;
}

export interface ISingleUserResponse {
  user: ISimpleUser;
}

export const getCurrentUser = (req: Request, res: Response) => {
  if (req.user) {
    res.json({
      user: req.user
    });
  } else {
    throw new UnauthorizedError();
  }
};

export const updateUser = (req: Request, res: Response) => {
  const email = req.params.email;

  console.log(email);
  console.log(req.body);

  if (req.user.admin != true && req.user.email != email) {
    throw new UnauthorizedError();
  }

  const updatePayload = req.body;

  User.findOneAndUpdate({ email }, updatePayload, { new: true }).then(user => {
    res.json({
      user: userToSimpleUser(user)
    } as ISingleUserResponse);
  });
};

export const listUsers = (req: Request, res: Response) => {
  User.find({}).then(users => {
    const simpleUsers = users.map(userToSimpleUser);

    res.json({
      users: simpleUsers
    } as IUserListResponse);
  });
};

export const firstTimeSetupHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const params = <ISetupQueryParams>req.query;
  if (params.key == Config.FIRST_TIME_SETUP_KEY) {
    User.count({ admin: true })
      .then(numUsers => {
        if (numUsers >= 1) {
          new Error("An admin has already been set.");
        } else {
          return User.findOne({ email: params.email });
        }
      })
      .then(user => {
        user.admin = true;
        user.approved = true;
        return user.save();
      })
      .then(user => {
        res.json({
          code: 200,
          message: `Successfully set ${user.firstName} as admin.`
        });
      })
      .catch(err => {
        next(new APIError(400, `Unable to set new admin, reason: ${err}`));
      });
  } else {
    throw new UnauthorizedError();
  }
};
