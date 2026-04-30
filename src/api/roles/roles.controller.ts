import { Request, Response } from "express";
import { Roles } from "./roles.model.js";
import { RoleStatus, RoleType } from "./roles.types.js";

export const getAllRoles = async (_: Request, res: Response) => {
    console.log("Obteniendo Todos los Roles desde la Base datos")
    try {
        const roles = await Roles.find();
        if (!roles.length) {
            console.error("No se han encontrado Roles");
            return res.status(404).json({ error: "No se han encontrado roles en la base de datos" })
        }

        return res.json({ roles })
    } catch (error) {
        console.error("Ha ocurrido un error obteniendo los roles", error);
        return res.status(500).json({ error: "Ha ocurrido un error oteniendo los Roles" })
    }
}

export const getOneRole = async (req: Request, res: Response) => {
    console.log(`Obteniendo el rol ${req.params?.id} de la base de datos`)
    try {
        const { id } = req.params;
        if (!id) {
            console.error("No se ha introducido ID en la Ruta")
            return res.status(404).json({ error: "No se han encontrado Roles" })
        }

        const role = await Roles.findById(id);
        console.log("ROLE", role)
        if (!role) {
            console.error("No se ha encontrado el role en la base de datos");
            return res.status(404).json({ error: "No se ha encontrado el Role en la base de datos" })
        }

        return res.json(role)
    } catch (error) {
        console.error("Ha ocurriduo un error mientras se buscaba el Role en la base de datos")
        return res.status(500).json({ error: "Error buscando Role en la base de datos" })
    }
}

export const createOneRole = async (req: Request, res: Response) => {
    console.log("Añadiendo Role a la base de datos");
    try {
        const { name, capabilities } = req.body;
        if (!name) {
            console.error("No se ha recibido el campo nombre");
            return res.status(400).json({ error: "El campo nombre es obligatorio" })
        }

        const newRole = {
            name,
            capabilities,
            ...req.body
        }

        const role = await Roles.create(newRole)

        return res.status(201).json(role)
    } catch (error) {
        console.error("Se ha producido un error añadiendo el role a la base de datos", error)
        return res.status(500).json({ error: "Error añadiendo Role a la base de datos" })
    }
}

export const editOneRoleName = async (req: Request, res: Response) => {
    console.log("Editando Role de la base de datos");
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            console.error("No se ha recibido el campo nombre");
            return res.status(400).json({ error: "No se ha recibido el campo nombre para modificar" })
        }

        const role = await Roles.findByIdAndUpdate(id, { name: name.trim() }, { returnDocument: "after" })

        return res.json(role)
    } catch (error) {
        console.error("Se ha producido un error modificando el Role", error);
        return res.status(500).json({ error: "Error modificando el nombre del Role" })
    }
}

export const toggleRoleStatus = async (req: Request, res: Response) => {
    console.log(`Cambiando el estado al role ${req.params?.id && req.params.id} en la base de datos`)
    try {
        const { id } = req.params;

        const role = await Roles.findById(id);
        if (!role) {
            console.error("No se ha encontrado el Role en la base de datos");
            return res.status(404).json({ error: `No se ha encontrado el Role ${id && id} en la base de datos` })
        }

        role.status = role.status === RoleStatus.ACTIVE ? RoleStatus.INACTIVE : RoleStatus.ACTIVE;

        await role.save();

        return res.json(role)
    } catch (error) {
        console.error("No se ha podido cambiar el estado al Role", error);
        return res.status(500).json({ error: "Error Camiando el Estado al Role en la base de datos" })
    }
}

export const addCapabilitiesToOneRole = async (req: Request, res: Response) => {
    console.log(`Añadiendo capabilities al Role ${req.params?.id && req.params.id} en la base de datos`);
    try {
        const { id } = req.params;
        const { capabilities } = req.body;
        if (!Array.isArray(capabilities) || !capabilities.length) {
            console.error("No se han recibido capabilities para agregar al Role");
            return res.status(400).json({ error: "Capabilities no recibidas o formato incorrecto" })
        }

        const trimmedCapabilities = capabilities
            .filter((capability): capability is string => typeof capability === "string")
            .map((capability) => capability.trim().toLowerCase());


        const role = await Roles.findById(id);
        if (!role) {
            console.error(`No se ha encontrado el Role ${id && id} en la base de datos`);
            return res.status(400).json({ error: "Role no encontrado en la base de datos" })
        }

        const settedCapabilities = Array.from(new Set([...trimmedCapabilities, ...role.capabilities || []]))
        role.capabilities = settedCapabilities;

        await role.save();

        return res.json(role);
    } catch (error) {
        console.error("Ha ocurrido un error añadiendo capabilities al Role", error);
        return res.status(500).json({ error: "Error Añadiendo capabilities al Role en la base de datos" })
    }
}

export const addCapabilitiesToAllRoles = async (req: Request, res: Response) => {
    console.log("Añadiendo Capabilities a todos los roles");
    try {
        const { capabilities } = req.body;
        const { status } = req.query;
        if (!Array.isArray(capabilities) || !capabilities.length) {
            console.error("No se han recibido capabilities");
            return res.status(400).json({ error: "No se han recibido Capabilities" })
        }
        if (status && status !== RoleStatus.ACTIVE && status !== RoleStatus.INACTIVE) {
            console.error(`El filtro de estado recibido ${status} no es valido`);
            return res.status(400).json({ error: `Filtro de estado recibido no valido '${status}'` })
        }

        const filter = status ? { status } : {};

        const trimmedCapabilities = capabilities
            .filter((capability): capability is string => typeof capability === "string")
            .map(capability => capability.trim().toLowerCase());
        if (!trimmedCapabilities.length) {
            console.error("Las Capabilities introducidas no son validas");
            return res.status(400).json({ error: "No se han introducido Capabilities validas" });
        }

        const updateOptions = {
            $addToSet: {
                capabilities: { $each: trimmedCapabilities }
            }
        }
        await Roles.updateMany(filter, updateOptions)

        return res.status(204).send();
    } catch (error) {
        console.error("Error añadiendo capabilities a los Roles", error)
        return res.status(500).json({ error: "Ha ocurrido un error añadiendo capabilities a los Roles en la base de datos" })
    }
};

export const removeCapabilitiesFromOneRole = async (req: Request, res: Response) => {
    console.log(`Eliminado Capabilities del Role ${req.params?.id && req.params.id} en la base de datos`);
    try {
        const { id } = req.params
        const { capabilities } = req.body;
        if (!Array.isArray(capabilities) || !capabilities.length) {
            console.error("No se han recibido Capabilities");
            return res.status(400).json({ error: "No se han recibido Capabilities" });
        }

        const trimmedCapabilities = capabilities
            .filter((capability): capability is string => typeof capability === "string")
            .map((capability) => capability.trim().toLowerCase());
        if (!trimmedCapabilities.length) {
            console.error("No se han recibido capabilities Validas");
            return res.status(400).json({ error: "No se han recibido Capabilities validas" })
        }

        const updateOptions = {
            $pull: {
                capabilities: { $in: trimmedCapabilities }
            }
        }

        const role = await Roles.findByIdAndUpdate(id, updateOptions, { returnDocument: "after" });
        if (!role) {
            console.error(`No se ha encontrado el Role ${id} en la base de datos`);
            return res.status(404).json({ error: "No se ha encontrado el Role en la base de datos" })
        }

        return res.json(role)
    } catch (error) {
        console.error("Ha ocurrido un error borrando las capabilities del Role en la base de datos", error)
        return res.status(500).json({ error: "Error Eliminando Capabilities del Role en la Base de datos" })
    }
}

export const removeCapabilitiesFromallRoles = async (req: Request, res: Response) => {
    console.log("Eliminando Capabilities de Todos los Roles en la base de datos");
    try {
        const { status } = req.query;
        if (status && status !== RoleStatus.ACTIVE && status !== RoleStatus.INACTIVE) {
            console.error(`Se ha recibido un filtro no valido '${status}`);
            return res.status(400).json({ error: `Filtro recibido no valido '${status}'` })
        }

        const { capabilities } = req.body;
        if (!Array.isArray(capabilities) || !capabilities.length) {
            console.error("No se han recibido Capabilities");
            return res.status(400).json({ error: "No se han recibido Capabilities" })
        }

        const trimmedCapabilities = capabilities
            .filter((capability): capability is string => typeof capability === "string")
            .map((capability) => capability.trim().toLowerCase());
        if (!trimmedCapabilities.length) {
            console.error("No se han recibido capabilities Validas");
            return res.status(400).json({ error: "Las Capabilities recibidas no son validas" })
        }

        const filter = status ? { status } : {};

        const updateOptions = {
            $pull: {
                capabilities: { $in: trimmedCapabilities }
            }
        }

        await Roles.updateMany(filter, updateOptions)
        
        return res.status(204).send();
    } catch (error) {
        console.error("Ha ocurrido un error eliminando capabilities de los Roles en la base de datos", error)
        return res.status(500).json({ error: "Ha ocurrido un error Eliminando capabilities de los roles en la base de datos" })
    }
}