
// import passport from "passport";
import { OAuth2Client } from 'google-auth-library'
// import UserModel from "../models/auth.model";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
const GOOGLE_CLIENT_ID =
  "886338139374-6cjmhp3ua9949fdjn66indvu405qgf0k.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
const REDIRECT_URL = "http://localhost:5000/auth/google/callback"
// export default () => {
//   passport.use(
//     new GoogleStrategy(
//       {
//         clientID: GOOGLE_CLIENT_ID as string,
//         clientSecret: GOOGLE_CLIENT_SECRET as string,
//         callbackURL: "/auth/google/callback",
//         // passReqToCallback: true
//       },
//       async (accessToken: any, refreshToken: any, profile: any, done: any) => {
//         console.log("accessToken", accessToken);
//         // console.log("refreshToken", refreshToken);
//         // console.log("profile", profile);
//         try {
//           const existingUser = await UserModel.findOne({
//             googleId: profile.id,
//           });
//           if (existingUser) {
//             return done(null, existingUser);
//           }
//           const newUser = new UserModel({
//             googleId: profile.id,
//             username: profile.displayName.replace(/\s+/g, ""),
//           });
//           await newUser.save();
//           return done(null, newUser);
//         } catch (error) {
//           console.log("error", error);
//         }
//       }
//     )
//   );
//   // Serialize and deserialize user
// };

const oAuth2Client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URL);
