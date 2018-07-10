import { NextFunction } from "express-serve-static-core";
import { Request, Response } from "express";
import { IUserModel } from "./models/User";
import { UnauthorizedError } from "./errors/Errors";
export const authenticationRequired = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.session.next = req.path;
        res.redirect("/login");
    }
};

export const adminRequired = (req: Request, _: Response, next: NextFunction) => {
    const user = <IUserModel>req.user;
    if (user.admin) {
        next();
    } else {
        throw new UnauthorizedError();
    }
};