import express, { Application } from "express";
import db from "./config/db.js";
import cors from "cors";

db.connect();

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3000;

app.use(express.json())

app.use(cors({
    // origin: ["http://localhost:3000", "miweb.com"]
}));

app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`)
})