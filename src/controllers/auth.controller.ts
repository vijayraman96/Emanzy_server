import express, { Request, Response } from "express";
import UserModel from "../models/auth.model";
import bcrypt from "bcrypt";
import Joi, { options } from "joi";
import { UserDocument } from "../interfaces/auth.interface";
import jwt, { Secret } from "jsonwebtoken";
import { OAuth2Client, Credentials } from "google-auth-library";
import axios from "axios";
import { SessionData } from "express-session";
import cookieParser from "cookie-parser";

declare module "express-session" {
  interface SessionData {
    token: string;
  }
}
// const GOOGLE_CLIENT_ID =
//     "886338139374-6cjmhp3ua9949fdjn66indvu405qgf0k.apps.googleusercontent.com";
// const GOOGLE_CLIENT_SECRET = "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";
// const REDIRECT_URI = "http://localhost:5000/auth/google/callback"

// interface CustomSessionData extends SessionData {
//     tokens?: Credentials;
// }

//
// const oAuth2Client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI);
// export const googleSignin = async (req: Request, res: Response) => {
//     console.log("vijay");
//     try {
//         const authUrl = oAuth2Client.generateAuthUrl({
//             access_type: 'offline',
//             scope: ['https://www.googleapis.com/auth/userinfo.profile'],
//             proxy: true
//         });
//         res.redirect(authUrl);
//         console.log('authUrl', authUrl);

//         // const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.profile`;

//         // res.redirect(authUrl);

//     } catch (error) {
//         console.log('error', error);
//         res.status(500).send('Internal Server Error');
//     }
// }
// export const googleCallback = async (req: Request, res: Response) => {
//     const { code } = req.query as { code?: string };

//     const { tokens } = await oAuth2Client.getToken(code as string);
//     console.log('tokens', tokens);

//     oAuth2Client.setCredentials(tokens);
//     oAuth2Client.on('tokens', (tokens) => {
//         if (tokens.refresh_token) {
//             // store the refresh_token in my database!
//             res.cookie('token', tokens.refresh_token, { httpOnly: true });
//             console.log(tokens.refresh_token);
//         }
//         console.log(tokens.access_token);
//     });

//     res.cookie('token', tokens.access_token, { httpOnly: true });

//     const profileResponse = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
//         headers: {
//             Authorization: `Bearer ${tokens.access_token}`,
//         },
//     });

//     // Handle user profile data
//     const userProfile = profileResponse.data;
//     console.log('User Profile:', userProfile);
//     res.redirect('http://localhost:3000/login');
// }
const saltRounds = 10;
export const signUp = async (
  req: Request<{}, {}, UserDocument>,
  res: Response
) => {
  const { userName, email, role, password, firstName, lastName } = req.body;
  const userExist = await UserModel.findOne({ email });
  console.log("userExist", userExist);

  if (userExist) {
    res.status(400).json({ error: "User already exists" });
  } else {
    let passwordHash: string | undefined;
    if (typeof password === "string") {
      passwordHash = await bcrypt.hash(password, saltRounds);
      console.log("passwordHash", passwordHash);
    }

    const signUpSchema = Joi.object({
      email: Joi.string()
        .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net", "io", "ai"] },
        }),
      firstName: Joi.string().alphanum().min(3).max(30).required(),
      lastName: Joi.string().alphanum().min(3).max(30).required(),
      role: Joi.string(),
      password: Joi.string()
        .min(4)
        .max(60)
        .pattern(
          new RegExp("^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};:'\"<>,./?|`~]*$")
        )
        .messages({
          "string.pattern.base":
            "Password must contain only alphanumeric and special characters",
        })
        .required(),
      userName: Joi.string().min(4).max(60).alphanum().required(),
    });

    const { error, value } = signUpSchema.validate({
      email,
      firstName,
      lastName,
      role,
      password: passwordHash,
      userName,
    });
    if (error) {
      console.log("error", error, "value", value);
      res
        .status(401)
        .json({
          error: `The ${error.details[0].message}. Due to that validation is failed. Please check again`,
        });
    } else {
      try {
        const user = new UserModel(value);
        await user.save();
        res.status(201).json({ success: true, data: value });
      } catch (err) {
        console.log(err, "err");
      }
    }
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const userExist = await UserModel.findOne({ email });
  console.log("userexist", userExist);

  const secretKey: Secret | undefined = process.env.JWT_SECRET_KEY;
  if (userExist) {
    let checkedPassword: any;
    if (password) {
      let hashedPassword: string = userExist.password as string;
      // bcrypt.compare(password, hashedPassword, (error: any, success: any) => {
      //     console.log('error', error, 'success', success);
      //     if (error) {
      //         res.status(401).json({ error: "The pasword doesnot match" });
      //     } else {
      //         checkedPassword = success;
      //     }
      // });
      const checkedPassword = await bcrypt.compare(password, hashedPassword);
      console.log(checkedPassword, "checkedPassword");
      if (!checkedPassword) {
        res.status(401).json({ error: "The password doesnot match" });
      }
      if (secretKey && checkedPassword) {
        const token = jwt.sign({ _id: userExist._id }, secretKey, {
          expiresIn: "14d",
        });
        console.log("tokken", token);
        req.session.token = token;
        console.log("req.session.token", req.session.token);
        res.json({ success: token });
      }
    } else {
      res.status(401).json({ error: "There is no passsword" });
    }
  } else {
    res.status(401).json({ error: "The user does not exist" });
  }
};

export const addElements = (req: Request, res: Response) => {
  try {
    console.log("the autenticated is successs");
    console.log(req.session.token);
    res.status(201).json({ success: "the route is autehnthicated" });
  } catch (error) {
    console.log("the autenticated is failed");
  }
};

export const logOut = (req: Request, res: Response) => {
  try {
    console.log("logout");
    console.log("session", req.session.token);
    req.session.destroy(function (err) {
      if (err) {
        console.log("error", err);
      }
    });
    if (req.session === undefined) {
      res
        .status(401)
        .json({ error: "The user has been logout. Please login again" });
    }
  } catch (error) {
    console.log("error", error);
  }
};
