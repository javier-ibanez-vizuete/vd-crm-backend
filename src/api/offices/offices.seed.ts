import mongoose from "mongoose";
import { CountryVariants, OfficeType } from "./offices.types.js";
import db from "../../config/db.js";
import { Offices } from "./offices.model.js";

const seedData: Partial<OfficeType>[] = [
    {
        name: "MADRID",
        country: CountryVariants.SPAIN,
    },
    {
        name: "LEON",
        country: CountryVariants.SPAIN
    },
    {
        name: "SALAMANCA",
        country: CountryVariants.SPAIN
    },
    {
        name: "MEDELLIN",
        country: CountryVariants.COLOMBIA
    },
    {
        name: "ALICANTE",
        country: CountryVariants.SPAIN
    }
];

mongoose
    .connect(db.DB_URL)
    .then(async () => {
        const allOffices = await Offices.find();
        if (allOffices.length) {
            console.log("Borrando Oficinas de la base de datos");
            await Offices.collection.drop();
        } else {
            console.warn("No se han encontrado oficinas en la base de datos, creando oficinas");
        }
    })
    .catch((error: unknown) => console.error("Ha ocurrido un error borrando usuarios de la base de datos", error))
    .then(async () => {
        await Offices.insertMany(seedData);
        console.log("Oficinas añadidas con exito a la base de datos");
    })
    .catch((error: unknown) => console.error("Ha ocurrido un error añadiendo las oficinas a la base de datos", error))
    .finally(() => {
        mongoose.disconnect();
        console.log("Desconectado de la base de datos")
    })