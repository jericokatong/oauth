const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  mongoURL: process.env.MONGO_URL,
  cookieKey: process.env.COOKIE_KEY,
};
