import express from "express";
import passport from "passport";
import {
  adminRequired,
  authenticationRequired,
  approvalRequired
} from "./middleware";
import {
  firstTimeSetupHandler,
  listUsers,
  getCurrentUser,
  updateUser,
  deleteUser,
  listPCPMentors
} from "./controllers/userController";
import { getSotongGuide } from "./controllers/contentController";
import {
  listTestBank,
  createSignedUpload,
  createTestBank,
  getOneTestbankFile
} from "./controllers/testBankController";
import { IUser, IUserModel } from "./models/User";

const apiRoutes = express.Router();

apiRoutes.get("/guide", getSotongGuide);
apiRoutes.get("/setup", authenticationRequired, firstTimeSetupHandler);

apiRoutes.get("/users/current", getCurrentUser);
apiRoutes.get("/users", adminRequired, listUsers);
apiRoutes.get("/users/pcp", authenticationRequired, listPCPMentors);
apiRoutes.put("/users/:email", authenticationRequired, updateUser);
apiRoutes.put("/users/:email/delete", adminRequired, deleteUser);

apiRoutes.get("/files", approvalRequired, listTestBank);
apiRoutes.post("/files/upload-url", approvalRequired, createSignedUpload);
apiRoutes.post("/files", approvalRequired, createTestBank);
apiRoutes.get("/files/:id", approvalRequired, getOneTestbankFile);

apiRoutes.use("/admin/*", adminRequired);

const authRoutes = express.Router();

authRoutes.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email", "public_profile"] })
);
authRoutes.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req, res) => {
    const user = <IUserModel>req.user;
    if (user.approved)
      res.redirect(req.session.next || "/");
    else
      res.redirect("/profile");
  }
);
authRoutes.get("/logout", (req: express.Request, res: express.Response) => {
  req.logout();
  res.redirect("/");
});

export { apiRoutes, authRoutes };
