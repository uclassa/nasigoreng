import { config } from "dotenv";

config();

const Config = {
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost/nasigoreng",
  PORT: process.env.PORT || 3000,
  SESSION_SECRET:
    process.env.SESSION_SECRET || "this-is-only-safe-for-local-dev",
  FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
  FIRST_TIME_SETUP_KEY: process.env.FIRST_TIME_SETUP_KEY || "uclassa",
  SOTONG_GUIDE_URL: process.env.SOTONG_GUIDE_URL,
  SITE_URL: process.env.SITE_URL || "",
  GCP_PROJECT_ID: process.env.GCP_PROJECT_ID || "",
  GCP_BUCKET_ID: process.env.GCP_BUCKET_ID || ""
};

// Required config
if (Config.GCP_PROJECT_ID === "") {
  throw new Error("GCP Project ID is not configured");
}

if (Config.GCP_BUCKET_ID === "") {
  throw new Error("The GCP Storage Bucket ID is not configured");
}

export default Config;
