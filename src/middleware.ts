import { NextFunction } from "express-serve-static-core";
import { Request, Response } from "express";
import { IUserModel, User } from "./models/User";
import { UnauthorizedError } from "./errors/Errors";
export const authenticationRequired = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.session.next = req.path;
    res.redirect("/login");
  }
};

export const approvalRequired = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  authenticationRequired(req, res, () => {
    const user = <IUserModel>req.user;
    if (user.approved) {
      next();
    } else {
      next(new UnauthorizedError());
    }
  });
};

export const adminRequired = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  authenticationRequired(req, res, () => {
    const user = <IUserModel>req.user;
    if (user.admin) {
      next();
    } else {
      next(new UnauthorizedError());
    }
  });
};
