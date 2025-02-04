import { Request, Response } from "express";
import UserModel from "../models/auth.model";
import bcrypt from "bcrypt";
import { UserDocument } from "../interfaces/auth.interface";
import jwt, { Secret } from "jsonwebtoken";
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import AWS from "aws-sdk"
import { v4 as uuidv4 } from "uuid"
import path from 'path';
import moment from "moment"
import { HttpCode, ResponseMessage } from "../constant";
import { cryptoEncrypt, readTemplate } from "../utils/functions";
import { iv, secretKey } from "../utils/variables";



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

  try {
    const { userName, email, role, password, firstName, lastName } = req.validatedData!;
    const userExist = await UserModel.findOne({ email });

    if (userExist) {
      res.status(HttpCode.BAD_REQUEST).json({ error: ResponseMessage.userExist });
    } else {
      let passwordHash: string | undefined;
      if (typeof password === "string") {
        passwordHash = await bcrypt.hash(password, saltRounds);
      }

      const signupToken = uuidv4();

      const date = moment().format("YYYY-MM-DD HH:mm:ss");


      let finalValue = { ...req.validatedData, email: email?.toLowerCase(), signupSecurity: [...[], { signup_token: signupToken }, { signup_token_created: date }, { crypto_token: secretKey }, { iv_token: iv }], password: passwordHash };

      const user = new UserModel(finalValue);
      const savedUser = await user.save();

      await sendSignupConfirmationEmail(req, res, savedUser);
      res.status(HttpCode.CREATED).json({ success: true, data: req.validatedData });

    }
  } catch (err) {
    const error = err as Error;
    res.status(HttpCode.BAD_REQUEST).json({ failure: true, error: error.message });
  }

};


AWS.config.update({
  region: 'ap-south-1', 
  accessKeyId: process.env.IAM_USER_ACCESS_KEY, 
  secretAccessKey: process.env.IAM_SECRET_ACCESS_KEY 
});

const ses = new AWS.SES();
const sendSignupConfirmationEmail = async (req: Request, res: Response, data: any) => {
  try {
    const { email, userName, signupSecurity, _id } = data;


    if (!email || !userName) {
      return res.status(HttpCode.BAD_REQUEST).json({ error: ResponseMessage.emailAndPassRequired });
    }

    const encodedUserId = cryptoEncrypt(`${_id}`);
    const encodedToken = cryptoEncrypt(signupSecurity[0]?.signup_token);
    const tokenGeneratedLink = `${process.env.FRONTEND_PORT}/admin/?z1=${encodedUserId}&a5=${encodedToken}`;

    const tokenData = { ...data, tokenGeneratedLink };

    const htmlContent = readTemplate(path.join(__dirname, '../templates/signupSuccessEmail.html'), tokenData);
    const params = {
      Source: 'admin@emanzy.shop',
      Destination: {
        ToAddresses: [email], // Recipient email address
      },
      Message: {
        Subject: {
          Data: "A Hearty welcome to the Admin Group", // Email subject
        },
        Body: {
          Text: {
            Data: "",
          },
          Html: {
            Data: htmlContent,
          },
        },
      },
    };

    ses.sendEmail(params, (err, data) => {
      if (err) console.error(ResponseMessage.errroSendingMail, err);
    });
  } catch (err) {

    res.status(500).send(ResponseMessage.errroSendingMail);
  }

}
export const login = async (req: Request, res: Response) => {

  const { email, password } = req.validatedData!;
  const userExist = await UserModel.findOne({ email });

  const secretKey: Secret | undefined = process.env.JWT_SECRET_KEY;
  if (userExist) {
    let checkedPassword: any;
    if (password) {
      let hashedPassword: string = userExist.password as string;

      const checkedPassword = await bcrypt.compare(password, hashedPassword);
      if (!checkedPassword) {
        res.status(HttpCode.BAD_REQUEST).json({ error: ResponseMessage.passwordDoesNotMatch });
      }
      if (secretKey && checkedPassword) {
        const token = jwt.sign({ _id: userExist._id }, secretKey, {
          expiresIn: "7d",
        });
        req.session.token = token;
        res.json({ success: { "token": token } });
      }
    } else {
      res.status(HttpCode.UN_AUTHORIZED).json({ error: ResponseMessage.passwordDoesNotExist });
    }
  } else {
    res.status(HttpCode.UN_AUTHORIZED).json({ error: ResponseMessage.userNotFound });
  }


};

export const addElements = (req: Request, res: Response) => {
  try {
    console.log("the autenticated is successs");
    // console.log(req.session.token);
    res.status(201).json({ success: "the route is autehnthicated" });
  } catch (error) {
    console.log("the autenticated is failed");
  }
};

export const logOut = (req: Request, res: Response) => {
  try {
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

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(400).json({ error: 'The user does not exist. So signup ' })
    }

    const createForgetPasswordToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = Date.now() + 10 * 60 * 1000;
    const secret = "EmanzyForgetPasswordKey";

    //creating the hashing password

    const hashForgotPassword = crypto.createHmac('sha256', secret).update(createForgetPasswordToken).digest('hex');
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GOOGLE_PASSWORD, // the app password Not your gmail password
      },
    });

    const resetUrl = `http://localhost:3000/reset-password?userId=${user?._id}&token=${hashForgotPassword}&expiry=${tokenExpiry}`

    const mailOptions = {
      to: email,
      from: process.env.GMAIL,
      subject: 'Password Reset Request',
      text: `
      <p>Hello,</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" target="_blank">${resetUrl}</a>
        <p>This link will expire in 10 minutes.</p>
    `
    };

    const successInfo = await transporter.sendMail(mailOptions);
    res.status(201).json({ success: true })
  } catch (error) {

  }
}
