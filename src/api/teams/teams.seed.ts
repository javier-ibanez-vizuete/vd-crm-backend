import mongoose from "mongoose";
import { TeamType } from "./teams.types.js";
import db from "../../config/db.js";
import { Teams } from "./teams.model.js";

const seedData: Partial<TeamType>[] = [
    {
        name: "TEAM MADRID 1",
    },
    {
        name: "TEAM MADRID 2",
    },
    {
        name: "TEAM COLOMBIA 1",
    },
    {
        name: "TEAM COLOMBIA 2"
    }
]

mongoose
    .connect(db.DB_URL)
    .then(async () => {
        const allTeams = await Teams.find();

        if (allTeams.length) {
            console.log("Borrando Equipos de la base de datos...")
            await Teams.collection.drop();
        } else {
            console.warn("No existen Equipos en la base de datos, creando equipos...")
        }
    })
    .catch((error: unknown) => console.error("Hubo un error borrando sueños", error))
    .then(async () => {
        await Teams.insertMany(seedData);
        console.log("Equipos añadidos con éxito");
    })
    .catch((error: unknown) => console.error("Hubo un problema añadiendo los equipos a la base de datos", error))
    .finally(() => {
        mongoose.disconnect();
        console.log("Desconectado de la base de datos")
    })