import express, { Application, Request, Response } from "express";
import db from "./config/db.js";
import cors from "cors";
import { usersRoutes } from "./api/users/users.routes.js";
import { rolesRoutes } from "./api/roles/roles.routes.js";
import { teamsRoutes } from "./api/teams/teams.routes.js";
import { officesRoutes } from "./api/offices/offices.routes.js";

db.connect();

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3000;

app.use(express.json())

app.use(cors({
    // origin: ["http://localhost:3000", "miweb.com"]
}));

app.get("/", (_: Request, res: Response) => res.json({message: "✅ Servidor Funcionando Correctamente"}))

app.use("/users", usersRoutes)

app.use("/roles", rolesRoutes);

app.use("/teams", teamsRoutes);

app.use("/offices", officesRoutes)

app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`)
})