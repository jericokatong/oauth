const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { clientID, clientSecret } = require("./index");
const User = require("../models/user-model");
const moment = require("moment");
const axios = require("axios");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL: "/auth/google/redirect",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("ini adalah profile google anda: ", profile);

      User.findOne({ googleId: profile.id }).then((currentUser) => {
        if (currentUser) {
          console.log("User is: ", currentUser);
          console.log("birthdate:", currentUser.birthdate.toISOString());
          done(null, currentUser);
        } else {
          const apiEndpoint = `https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,genders,birthdays`;
          const config = {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };

          axios.get(apiEndpoint, config).then((response) => {
            const data = response.data;
            // console.log("Data dari Google People API:", data);
            // console.log("Data dari Google People API birthdays:", data.birthdays);

            // console.log("ini tahun", typeof data.birthdays[0].date.year);
            // console.log("ini bulan", data.birthdays[0].date.month);
            // console.log("ini tanggal", data.birthdays[0].date.day);
            // const birthdate = new Date(data.birthdays[0].date.year, data.birthdays[0].date.month - 1, data.birthdays[0].date.day);
            const birthdate = moment([data.birthdays[0].date.year, data.birthdays[0].date.month - 1, data.birthdays[0].date.day + 1]);
            console.log("ini birthdate: ", birthdate);
            if (birthdate && data.genders.value) {
              User.create({
                googleId: profile.id,
                username: profile.displayName,
                thumbnail: profile._json.picture,
                gender: data.genders.value,
                birthdate,
              }).then((newUser) => {
                console.log("Ini newUser: ", newUser);
                done(null, newUser);
              });
            } else if (birthdate) {
              User.create({
                googleId: profile.id,
                username: profile.displayName,
                thumbnail: profile._json.picture,
                gender: null,
                birthdate,
              }).then((newUser) => {
                console.log("Ini newUser: ", newUser);
                done(null, newUser);
              });
            } else if (data.genders.value) {
              User.create({
                googleId: profile.id,
                username: profile.displayName,
                thumbnail: profile._json.picture,
                gender: data.genders.value,
                birthdate: null,
              }).then((newUser) => {
                console.log("Ini newUser: ", newUser);
                done(null, newUser);
              });
            }
          });
        }
      });

      // Tanggal lahir tersedia dalam objek profile jika diberikan izin
      //   const birthday = profile._json.birthday;
      //   console.log("Tanggal lahir: ", birthday);
    }
  )
);
