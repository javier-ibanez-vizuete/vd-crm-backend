import { Request, Response } from "express";
import { Users } from "../users/users.model.js";

const userKeysToPopulate = ["id", "email", "name", "office", "team"] as const;
export const USER_INFO_FIELDS = userKeysToPopulate.join(" ");

export const getAllUsers = async (_: Request, res: Response) => {
    console.log("Obteniendo Todos los usuarios '/users");
    try {
        const users = await Users.find().populate("role");
        if (!users.length) {
            console.error("No se han encontrado usuarios");
            return res.status(404).json({ error: "No se han encontrado usuarios en la base de datos" })
        }

        return res.json({ users })
    } catch (error) {
        console.error("Ha ocurrido un problema obteniendo los usuarios", error)
        return res.status(500).json({ error: "Hubo un problema obteniendo los usuarios de la base de datos" });
    }
}