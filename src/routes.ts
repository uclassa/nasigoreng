import express from "express";
import passport from "passport";
import { adminRequired, authenticationRequired } from "./middleware";
import { firstTimeSetupHandler, listUsers, getCurrentUser } from "./controllers/userController";
import { getSotongGuide } from "./controllers/contentController";

const apiRoutes = express.Router();

apiRoutes.get("/guide", getSotongGuide);
apiRoutes.get("/setup", authenticationRequired, firstTimeSetupHandler);
apiRoutes.get("/users/current", getCurrentUser);
apiRoutes.get("/users", authenticationRequired, listUsers);

apiRoutes.use("/admin/*", adminRequired);

const authRoutes = express.Router();

authRoutes.get("/facebook", passport.authenticate("facebook", {scope: ["email", "public_profile"]}));
authRoutes.get("/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login"}), (req, res) => {
    res.redirect(req.session.next || "/profile");
});
authRoutes.get("/logout", (req: express.Request, res: express.Response) => {
    req.logout();
    res.redirect("/");
});

export {apiRoutes, authRoutes};