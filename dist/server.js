import express from 'express';
const app = express();
// dotenv.config();
const port = process.env.PORT || 5000;
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
