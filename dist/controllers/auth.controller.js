"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.logOut = exports.addElements = exports.login = exports.signUp = void 0;
const auth_model_1 = __importDefault(require("../models/auth.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const joi_1 = __importDefault(require("joi"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
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
const signUp = async (req, res) => {
    const { userName, email, role, password, firstName, lastName } = req.body;
    const userExist = await auth_model_1.default.findOne({ email });
    if (userExist) {
        res.status(400).json({ error: "User already exists" });
    }
    else {
        let passwordHash;
        if (typeof password === "string") {
            passwordHash = await bcrypt_1.default.hash(password, saltRounds);
            console.log("passwordHash", passwordHash);
        }
        const signUpSchema = joi_1.default.object({
            email: joi_1.default.string()
                .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
                .email({
                minDomainSegments: 2,
                tlds: { allow: ["com", "net", "io", "ai"] },
            }),
            firstName: joi_1.default.string().alphanum().min(3).max(30).required(),
            lastName: joi_1.default.string().alphanum().min(3).max(30).required(),
            role: joi_1.default.string(),
            password: joi_1.default.string()
                .min(4)
                .max(60)
                .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};:'\"<>,./?|`~]*$"))
                .messages({
                "string.pattern.base": "Password must contain only alphanumeric and special characters",
            })
                .required(),
            userName: joi_1.default.string().min(4).max(60).alphanum().required(),
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
        }
        else {
            try {
                let finalValue = { ...value, email: email === null || email === void 0 ? void 0 : email.toLowerCase() };
                const user = new auth_model_1.default(finalValue);
                await user.save();
                res.status(201).json({ success: true, data: value });
            }
            catch (err) {
                res.status(400).json({ failure: true });
            }
        }
    }
};
exports.signUp = signUp;
const login = async (req, res) => {
    const { email, password } = req.body;
    const userExist = await auth_model_1.default.findOne({ email });
    const signInSchema = joi_1.default.object({
        email: joi_1.default.string()
            .email({
            minDomainSegments: 2,
        })
            .pattern(/^[^\s@]+@[^\s@]+\.(com|net|io|ai)$/)
            .messages({
            "string.email": 'The email must contain @ symbol and a valid domain',
            "string.pattern.base": 'The email domain must end with .com, .net, .io, or .ai',
            'any.required': 'Email is required'
        }),
        password: joi_1.default.string()
            .min(4)
            .max(60)
            .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};:'\"<>,./?|`~]*$"))
            .messages({
            "string.pattern.base": "Password must contain only alphanumeric and special characters",
        })
            .required(),
    });
    const { error, value } = signInSchema.validate({
        email,
        password
    });
    console.log('error', error);
    if (error) {
        console.log(error.details[0].message);
        res
            .status(401)
            .json({
            error: `The ${error.details[0].message}. Due to that validation is failed. Please check again`,
        });
    }
    else {
        const secretKey = process.env.JWT_SECRET_KEY;
        if (userExist) {
            let checkedPassword;
            if (password) {
                let hashedPassword = userExist.password;
                // bcrypt.compare(password, hashedPassword, (error: any, success: any) => {
                //     console.log('error', error, 'success', success);
                //     if (error) {
                //         res.status(401).json({ error: "The pasword doesnot match" });
                //     } else {
                //         checkedPassword = success;
                //     }
                // });
                const checkedPassword = await bcrypt_1.default.compare(password, hashedPassword);
                if (!checkedPassword) {
                    res.status(401).json({ error: "The password doesnot match" });
                }
                if (secretKey && checkedPassword) {
                    const token = jsonwebtoken_1.default.sign({ _id: userExist._id }, secretKey, {
                        expiresIn: "7d",
                    });
                    console.log("tokken", token);
                    req.session.token = token;
                    console.log("req.session.token", req.session.token);
                    res.json({ success: { "token": token } });
                }
            }
            else {
                res.status(401).json({ error: "There is no passsword" });
            }
        }
        else {
            res.status(401).json({ error: "The user does not exist" });
        }
    }
};
exports.login = login;
const addElements = (req, res) => {
    try {
        console.log("the autenticated is successs");
        console.log(req.session.token);
        res.status(201).json({ success: "the route is autehnthicated" });
    }
    catch (error) {
        console.log("the autenticated is failed");
    }
};
exports.addElements = addElements;
const logOut = (req, res) => {
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
    }
    catch (error) {
        console.log("error", error);
    }
};
exports.logOut = logOut;
const resetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        console.log("email", email);
        const user = await auth_model_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ error: 'The user does not exist. So signup ' });
        }
        const createForgetPasswordToken = crypto_1.default.randomBytes(32).toString('hex');
        const tokenExpiry = Date.now() + 10 * 60 * 1000;
        const secret = "EmanzyForgetPasswordKey";
        //creating the hashing password
        const hashForgotPassword = crypto_1.default.createHmac('sha256', secret).update(createForgetPasswordToken).digest('hex');
        console.log('hashForgotPassword', hashForgotPassword);
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL,
                pass: process.env.GOOGLE_PASSWORD, // the app password Not your gmail password
            },
        });
        const resetUrl = `http://localhost:3000/reset-password?userId=${user === null || user === void 0 ? void 0 : user._id}&token=${hashForgotPassword}&expiry=${tokenExpiry}`;
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
        res.status(201).json({ success: true });
    }
    catch (error) {
    }
};
exports.resetPassword = resetPassword;
