import { config } from "dotenv";

config();

const Config = {
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost/nasigoreng",
    PORT: process.env.PORT || 3000,
    SESSION_SECRET: process.env.SESSION_SECRET || "this-is-only-safe-for-local-dev",
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
    FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
    FIRST_TIME_SETUP_KEY: process.env.FIRST_TIME_SETUP_KEY,
    SOTONG_GUIDE_URL: process.env.SOTONG_GUIDE_URL
};

export default Config;