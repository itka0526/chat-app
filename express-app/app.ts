import express from "express";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get("/", (_, res) => res.send("Hello World! "));

app.listen(PORT, () => console.log("server is running on port: " + PORT));
