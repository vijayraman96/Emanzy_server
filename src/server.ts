
import dotenv from "dotenv";
import express from 'express';
import { Request, Response } from "express";
import mongoose from "mongoose";
import userRoute from './routes/user.routes';
import bodyParser from "body-parser";
import cors, { CorsOptions } from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';


dotenv.config();
console.log(process.env.GOOGLE_CLIENT_ID);

const mongoUri = process.env.MONGO_URI as string;
console.log("mongoUrl", mongoUri);

const app: express.Application = express();
const port = process.env.PORT || 2;

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
app.use(cookieParser());
app.use(session({
  secret: 'emanzy_dress_code',
  resave: false,
  saveUninitialized: true
}));
const corsOptions: CorsOptions = {
  origin: ['http://localhost:3002', 'http://dashboard.emanzy.shop'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Additional Middleware (if needed)
app.use((req, res, next) => {
  console.log("Request Origin:", req.headers.origin);
  console.log("Request Method:", req.method);
  next();
});


app.get("/", (req: Request, res: Response) => {
  console.log("fvkfenvklenkenknkern");
  res.send("Express + TypeScript Server");
  // res.send("Express + TypeScript Server");
});
app.get("/date", (req: Request, res: Response) => {
  console.log("vijay");
  res.json("hello vijay ! Welcome  back to the backed ");
});
mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/auth', userRoute);
// app.listen(port, () => {
//   console.log(`[server]: Server is running at http://localhost:${process.env.PORT}`);
//   console.log(mongoUri);
  
// });

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
  console.log(`Process ID: ${process.pid}`);
});