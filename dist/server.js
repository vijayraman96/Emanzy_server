"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
console.log(process.env.GOOGLE_CLIENT_ID);
const mongoUri = process.env.MONGO_URI;
console.log("mongoUrl", mongoUri);
const app = (0, express_1.default)();
const port = process.env.PORT || 2;
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: 'emanzy_dress_code',
    resave: false,
    saveUninitialized: true
}));
const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend's origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};
app.use((0, cors_1.default)(corsOptions));
app.get("/", (req, res) => {
    console.log("fvkfenvklenkenknkern");
    // res.send("Express + TypeScript Server");
});
app.get("/date", (req, res) => {
    console.log("vijay");
    res.json("hello vijay ! Welcome  back to the backed ");
});
mongoose_1.default
    .connect(mongoUri)
    .then(() => console.log("MongoDB Connected..."))
    .catch(err => console.log(err));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use('/auth', user_routes_1.default);
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${process.env.PORT}`);
    console.log(mongoUri);
});
