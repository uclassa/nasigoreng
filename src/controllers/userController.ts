import { Request, Response, NextFunction } from "express";
import Config from "../config";
import { UnauthorizedError, APIError } from "../errors/Errors";
import { User } from "../models/User";

interface ISetupQueryParams {
    key?: string;
    email?: string;
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

export const listUsers = (req: Request, res: Response) => {
    User.find({})
    .then((users) => {
        res.json({
            data: users
        });
    });
};

export const firstTimeSetupHandler = (req: Request, res: Response, next: NextFunction) => {
    const params = <ISetupQueryParams>req.query;
    if (params.key == Config.FIRST_TIME_SETUP_KEY) {
        User.count({admin: true})
        .then((numUsers) => {
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
        .catch((err) => {
            next(new APIError(400, `Unable to set new admin, reason: ${err}`));
        });
    } else {
        throw new UnauthorizedError();
    }
};