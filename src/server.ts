import express from "express";
import session from "express-session";
import path from "path";
import mongoose from "mongoose";
import connectMongo from "connect-mongo";
import { Request, Response } from "express";
import * as bodyParser from "body-parser";

import Config from "./config";
import { apiRoutes, authRoutes } from "./routes";
import { APIError } from "./errors/Errors";
import { NextFunction } from "connect";

import passport from "./auth";

const MongoStore = connectMongo(session);
const app = express();

// This connects to MongoDB, the database where we store our data
mongoose.connect(
  Config.MONGO_URI,
  err => {
    if (err) {
      console.error(
        `Failed to connect to MongoDB at ${Config.MONGO_URI}. Exiting.`
      );
      console.error(err);
      process.exit(1);
    }
  }
);

// Middleware for maintaining cookies and other session state
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: Config.SESSION_SECRET,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

// Middleware for authenticating users
app.use(passport.initialize());
app.use(passport.session());

// Parse Json bodies
app.use(bodyParser.json());

// Register all our API endpoints
app.use("/api", apiRoutes);
app.use("/auth", authRoutes);

// Handle all errors
app.use("/api", (err: Error, _: Request, res: Response, __: NextFunction) => {
  if (err instanceof APIError) {
    console.error(err);
    res.status(err.code).json({
      code: err.code,
      error: err.name,
      message: err.message,
      payload: err.payload
    });
  } else {
    console.error(err);
    res.status(500).json({
      code: 500,
      error: "Unexpected Server Error"
    });
  }
});

// Serve everything in the static folder as static files
app.use(express.static(path.join(__dirname, "static")));

// Redirect everything else to frontend
app.get("*", (_, response) => {
  response.sendFile(path.resolve(__dirname, "static/index.html"));
});

// Start the server
app.listen(Config.PORT, () => {
  console.log("Server is running!");
});
