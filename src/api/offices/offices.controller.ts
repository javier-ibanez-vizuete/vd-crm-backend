import { Request, Response } from "express";
import { Offices } from "./offices.model.js";
import { OfficeType } from "./offices.types.js";

export const getAllOffices = async (_: Request, res: Response) => {
    console.log("Obteniendo Oficinas de la base de datos");
    try {
        const offices = await Offices.find().select("+isDeleted");
        if (!offices.length) {
            console.error("No se han encontrado oficinas en la base de datos");
            return res.status(404).json({ error: "No existen oficinas en la base de datos" })
        }
        return res.json({ offices })
    } catch (error) {
        console.error("Ha ocurrido un error obteniendo oficinas de la base de datos");
        return res.status(500).json({ error: "Error al obtener Oficinas de la Base de Datos" })
    }
};

export const getOneOffice = async (req: Request, res: Response) => {
    console.log(`Obteniendo Oficina ${req.params.id && req.params.id} de la base de datos`);
    try {
        const { id } = req.params;

        const office = await Offices.findById(id).select("-isDeleted");
        if (!office) {
            console.error("No se ha encontrado la oficina en la base de datos");
            return res.status(404).json({ error: "No existe la oficina en la base de datos" })
        }

        return res.json({ office })
    } catch (error) {
        console.error("Error Obteniendo Oficina de la base de datos");
        return res.status(500).json({ error: "Ha ocurrido un error obteniendo la oficina de la base datos" })
    }
};

export const createOffice = async (req: Request, res: Response) => {
    console.log("añadiendo oficina a la base de datos")
    try {
        const { name, country }: OfficeType = req.body;
        if (!name.trim()) {
            console.error("No se ha recibido el campo nombre");
            return res.status(400).json({ error: "El campo nombre es obligatorio" })
        }
        if (!country) {
            console.error("No se ha recibido el campo pais");
            return res.status(400).json({ error: "El campo pais es obligatorio" })
        }

        const newOffice: OfficeType = {
            ...req.body,
            nameToSave: name.toLowerCase().trim()
        }

        const alreadyExist = await Offices.find({ nameToSave: newOffice.nameToSave })
        if (alreadyExist.length) {
            console.error("La oficina que intenta crear ya existe");
            return res.status(409).json({ error: "La oficina ya existe en la base de datos" })
        }

        const office = await Offices.create(newOffice);
        const officeToSend = {
            id: office.id,
            name: office.name,
            country: office.country
        }

        return res.status(201).json(officeToSend)
    } catch (error) {
        console.error("Ocurrio un error creando una oficina");
        return res.status(500).json({ error: "Error creando oficina" })
    }
};

export const deleteOneOffice = async (req: Request, res: Response) => {
    console.log("Eliminando oficina de la base de datos");
    try {
        const { id } = req.params;

        const office = await Offices.findByIdAndUpdate(id, { isDeleted: true })

        return res.status(204).send();
    } catch (error) {
        console.error("Ha ocurrido un error Eliminando la oficina de la base de datos")
        return res.status(500).json({error: "Error eliminando oficina de la base de datos"})
    }
}