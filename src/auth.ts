import passport from "passport";
import { Strategy as FacebookStrategy, Profile } from "passport-facebook";
import { Request } from "express";

import Config from "./config";
import { User, IUserModel, IUser } from "./models/User";

passport.serializeUser<IUserModel, string>((user, done) => {
    done(undefined, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new FacebookStrategy({
    clientID: Config.FACEBOOK_CLIENT_ID,
    clientSecret: Config.FACEBOOK_CLIENT_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ["name", "email", "link"],
    passReqToCallback: true
}, (req: Request, accessToken: string, _: string, profile: Profile, done) => {
    if (req.user) {
        // There is a user logged in
        User.findOne({ fbUserId: profile.id }, (err, existingUser) => {
            if (err || existingUser) {
                // Either error or no error, but have existing user with this Facebook profile ID
                done(err);
            } else {
                // Existing user that's unlinked
                User.findById(req.user.id, (err, user: IUserModel) => {
                    if (err) {
                        done(err);
                    } else {
                        user.fbUserId = profile.id;
                        user.fbToken = accessToken;
                        user.firstName = user.firstName || profile.name.givenName;
                        user.lastName = user.lastName || profile.name.familyName;
                        user.image = user.image || `https://graph.facebook.com/${profile.id}/picture?type=large`;
                        user.save((err) => {
                            done(err, user);
                        });
                    }
                });
            }
        });
    } else {
        // There isn't a currently logged in user
        User.findOne({ fbUserId: profile.id }, (err, existingUser) => {
            if (err) {
                done(err);
            } else if (existingUser) {
                done(undefined, existingUser);
            } else {
                const user = new User();
                user.email = profile._json.email;
                user.fbUserId = profile.id;
                user.fbToken = accessToken;
                user.firstName = profile.name.givenName;
                user.lastName = profile.name.familyName;
                user.image = `https://graph.facebook.com/${profile.id}/picture?type=large`;
                user.save((err) => {
                    done(err, user);
                });
            }
        });
    }
}));

export default passport;