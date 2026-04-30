import { Request, Response } from "express";
import { Teams } from "./teams.model.js";
import { USER_INFO_FIELDS } from "../users/users.controller.js";
import { TeamType } from "./teams.types.js";
import { Users } from "../users/users.model.js";
import { ObjectId } from "mongoose";
import { UserStatus, UserType } from "../users/users.types.js";

export const getAllTeams = async (req: Request, res: Response) => {
    console.log("Obteniendo todos los equipos");
    try {
        const { deleted } = req.query as { deleted?: string };

        const isDeleted = deleted !== undefined ? { isDeleted: deleted === "true" } : {};

        const teams = await Teams.find(isDeleted)
            .populate("responsible", USER_INFO_FIELDS)
            .populate("members", USER_INFO_FIELDS)
        if (!teams.length) {
            console.error("No se han encontrado Teams");
            return res.status(404).json({ error: "No se Encontraron Equipos en la base de datos" })
        }

        return res.json({ teams })
    } catch (error) {
        console.error("Error Obteniendo Equipos");
        return res.status(500).json({ error: "Ha Ocurrido un error obteniendo Equipos de la base de datos" })
    }
};

export const getOneTeam = async (req: Request, res: Response) => {
    console.log(`Obteniendo equipo ${req.params?.id && req.params.id} de la base de datos`);
    try {
        const { id } = req.params;
        const { isDeleted } = req.query;

        const teamOptions = isDeleted !== undefined ? { _id: id, isDeleted: isDeleted === "true" } : { _id: id };

        const team = await Teams.findOne(teamOptions)
            .populate("responsible", USER_INFO_FIELDS)
            .populate("members", USER_INFO_FIELDS)
        if (!team) {
            console.error(`No se ha encontrado el equipo ${id} en la base de datos`);
            return res.status(404).json({ error: `No se ha encontrado al equipo ${id} en la base de datos` })
        }

        return res.json(team);
    } catch (error) {
        console.error("Error obteniendo Equipo de la base de datos", error);
        return res.status(500).json({ error: "Ha ocurrido un error obteniendo el equipo de la base de datos" })
    }
}

export const addTeam = async (req: Request, res: Response) => {
    console.log("Añadiendo Equipo a la base de datos");
    try {
        const { name, members } = req.body;
        if (!name || typeof name !== "string") {
            console.error("No se ha recibido el campo nombre");
            return res.status(400).json({ error: "El campo nombre es obligatorio" })
        }
        if (members && !Array.isArray(members)) {
            console.error("El formato de el campo miembros es incorrecto", members);
            return res.status(400).json({ error: "El formato del campo miembros no es valido" })
        }

        const nameToSave = name.trim().toLowerCase().replaceAll(" ", "-");

        const alreadyExist = await Teams.findOne({ nameToSave });
        if (alreadyExist) {
            console.error("El nombre introducido ya existe");
            return res.status(409).json({ error: "El nombre de equipo introducido ya existe" })
        }

        const newTeam: Omit<TeamType, "id"> = {
            name,
            nameToSave,
            members: members ?? [],
            isDeleted: false,
        }

        const team = await Teams.create(newTeam)

        const teamToSend = {
            id: team.id,
            name: team.name,
            responsible: team.responsible ?? undefined,
            members: team.members,
        }

        return res.status(201).json(teamToSend)
    } catch (error) {
        console.error("Ha ocurrido un error añadiendo el equipo a la base de datos");
        return res.status(500).json({ error: "Error añadiendo equipo a la base de datos" })
    }
}

export const addTeamMembers = async (req: Request, res: Response) => {
    console.log(`Añadiendo miembros del equipo ${req.params?.id && req.params?.id} en la base de datos`)
    try {
        const { id } = req.params;

        const { members } = req.body;
        if (!members || !Array.isArray(members)) {
            console.error("No se han recibido miembros para añadir al equipo");
            return res.status(400).json({ error: "No se han recibido miembros validos para añadir al equipo" })
        }

        const membersToValidate = await Users.find({ _id: { $in: members }, status: UserStatus.ACTIVE }).select("id");
        if (!membersToValidate.length) {
            console.error("No se han recibido miembros validos para añadir");
            return res.status(404).json({ error: "Los miembros para añadir no existen en la base de datos" })
        }

        const team = await Teams.findById(id).select("isDeleted members");
        if (!team || team.isDeleted) {
            console.error(`No se ha encontrado el Equipo ${id}`);
            return res.status(404).json({ error: "El equipo no existe en la base de datos" });
        }

        const validMembersIds = membersToValidate.map((member: UserType) => member.id);

        const uniqueMembers = validMembersIds.filter(id => !team.members?.includes(id))
        if (!uniqueMembers.length) {
            console.error("No hay miembros nuevos para añadir al equipo")
            return res.status(409).json({ error: "Los miembros que intentas añadir ya pertenecen al equipo" })
        }

        await Users.updateMany({ id: { $in: uniqueMembers } }, { team: id });

        team.members?.push(...uniqueMembers)

        await team.save();

        return res.json(team)
    } catch (error) {
        console.error("Ocurrio un error añadiendo miembros al grupo", error);
        return res.status(500).json({ error: "Ocurrio un error mientras se añadian miembros al equipo en la base de datos" })
    }
}

export const editTeamName = async (req: Request, res: Response) => {
    console.log(`Editando equipo ${req.params?.id && req.params.id} en la base de datos`);
    try {
        const { id } = req.params;

        const { name } = req.body;
        if (!name || typeof name !== "string") {
            console.error("Campo nombre no recibido o formato incorrecto");
            return res.status(400).json({ error: "Campo nombre faltante o formato incorrecto" })
        }

        const nameToSave = name.trim().toLowerCase().replaceAll(" ", "-");
        if (!nameToSave) {
            console.error("No se ha recibido un campo nombre valido");
            return res.status(400).json({ error: "El campo nombre no es valido" })
        }

        const alreadyExist = await Teams.findOne({ nameToSave })
        if (alreadyExist) {
            console.error("El nombre Solicitado ya existe");
            return res.status(409).json({ error: "El nombre de equipo solicitado no es valido" });
        }

        const fieldsToChange = {
            name,
            nameToSave
        }

        const team = await Teams.findOneAndUpdate({ _id: id, isDeleted: false }, fieldsToChange, { returnDocument: "after" })
        if (!team) {
            console.error(`No se ha encontrado el Equipo ${id} en la base de datos`);
            return res.status(404).json({ error: "Equipo no encontrado en la base de datos" })
        }

        return res.json(team)
    } catch (error) {
        console.error("Ha ocurrido un error editando el equipo en la base de datos", error)
        return res.status(500).json({ error: "Error editando Equipo en la base datos" })
    }
}

export const editTeamResponsible = async (req: Request, res: Response) => {
    console.log("Editando Responsable de Equipo");
    try {
        const { id, responsibleId } = req.params;
        if (Array.isArray(responsibleId)) {
            console.error("Formato para campo responsable incorrecto");
            return res.status(400).json({ error: "Formato del campo responsable incorrectos" })
        }

        const team = await Teams.findById(id).select("isDeleted responsible");
        if (!team || team.isDeleted) {
            console.error("No se ha encontrado al equipo en la base de datos");
            return res.status(404).json({ error: "El equipo no existe en la base de datos" })
        }

        const currentResponsible = team.responsible as ObjectId | undefined;
        if (currentResponsible?.toString() === responsibleId) {
            console.error("El responsable a asignar es el mismo");
            return res.status(400).json({ error: "El usuario para asignar ya es responsable del grupo" })
        }

        const user = await Users.findById(responsibleId).select("status");
        if (!user || user.status === UserStatus.BANNED || user.status === UserStatus.INACTIVE) {
            console.error("El responsible a añadir no existe");
            return res.status(404).json({ error: "El usuario para añadir de responsable no existe en la base datos" })
        }

        const newTeam = await Teams.findByIdAndUpdate(id, { responsible: responsibleId }, { returnDocument: "after" }).select("name responsible")

        return res.json(newTeam)
    } catch (error) {
        console.error("Ha ocurrido un error al editar responsable de en la base de datos", error)
        return res.status(500).json({ error: "Ocurrió un error editando el responsable del equipo en la base de datos" })
    }
}

export const editTeamMembers = async (req: Request, res: Response) => {
    console.log("Editando Miembros del Equipo");
    try {
        const { id } = req.params;

        const { members } = req.body;
        if (!members || !Array.isArray(members)) {
            console.error("No se han recibido miembros para añadir al equipo");
            return res.status(400).json({ error: "No se han recibido miembros validos para añadir al equipo" })
        }

        const membersToValidate = await Users.find({ _id: { $in: members }, status: UserStatus.ACTIVE }).select("id");
        if (!membersToValidate.length) {
            console.error("No se han recibido miembros validos para añadir");
            return res.status(404).json({ error: "Los miembros para añadir no existen en la base de datos" })
        }

        const team = await Teams.findById(id).select("isDeleted members");
        if (!team || team.isDeleted) {
            console.error(`No se ha encontrado el Equipo ${id}`);
            return res.status(404).json({ error: "El equipo no existe en la base de datos" });
        }

        // Convertimos los IDs válidos a string para comparar por valor
        const validMembersIds = membersToValidate.map(
            (member) => member.id
        );
        const validMembersIdsStr = validMembersIds.map((id) => id.toString());

        // Usamos .toString() en cada member para evitar el error de tipos
        const usersToRemove = team.members?.filter(
            (member) => !validMembersIdsStr.includes(member.toString())
        );

        if (usersToRemove?.length) {
            await Users.updateMany(
                { _id: { $in: usersToRemove } },
                { $unset: { team: "" } }
            );
        }

        await Users.updateMany(
            { _id: { $in: validMembersIds } },
            { team: id }
        );

        team.members = [...validMembersIds];

        console.log(team.members)
        await team.save();

        return res.json(team)
    } catch (error) {
        console.error("Ha ocurrido un error Editando miembros en el equipo de la base de datos", error);
        return res.status(500).json({ error: "Error al editar miembros del equipo en la base de datos" })
    }
}

export const deleteTeamMembers = async (req: Request, res: Response) => {
    console.log(`Eliminando miembros del equipo ${req.params?.id && req.params.id} en la base de datos`);
    try {
        const { id } = req.params;
        const { members } = req.body;
        if (!members || !Array.isArray(members)) {
            console.error("No se han recibido miembros para borrar del equipo");
            return res.status(400).json({ error: "No se han recibido miembros validos para borrar del equipo" })
        }
        const memberToDelete = members.filter(member => (typeof member === "string") && member)

        const team = await Teams.findById(id).select("isDeleted members");
        if (!team || team.isDeleted) {
            console.error("No se ha encontrado al equipo en la base de datos");
            return res.status(404).json("No se encuentra el Equipo en la base de datos");
        }

        if (team.members) {
            team.members = team.members.filter(member => !memberToDelete.includes(member.toString()))
        }

        await team.save();

        return res.json(team)
    } catch (error) {
        console.error("Ha ocurrido un error eliminando miembros del equipo en la base de datos", error)
        return res.status(500).json({ error: "Error Eliminando miembros del equipo en la base de datos" })
    }
}

export const deleteOneTeam = async (req: Request, res: Response) => {
    console.log(`Borrando Equipo 'Logico' ${req.params?.id && req.params.id} de la base de datos`)
    try {
        const { id } = req.params;

        const team = await Teams.findByIdAndUpdate(id, { isDeleted: true }, { returnDocument: "after" })
        if (!team) {
            console.error(`No se ha encontrado el equipo ${id} en la base de datos`)
            return res.status(404).json({ error: `No se ha encontrado el equipo ${id} en la base de datos` })
        }

        return res.status(204).send();
    } catch (error) {
        console.error("Ha ocurrido un error eliminado el equipo de la base de datos", error)
        return res.status(500).json({ error: "Error Eliminando equipo de la base de datos" })
    }
}

export const deleteAllTeams = async (req: Request, res: Response) => {
    console.log("Borrando los equipos de la base de datos");
    try {
        const teams = await Teams.updateMany({ isDeleted: false }, { isDeleted: true })
        if (!teams.matchedCount) {
            console.error("No se han encontrado Equipos para eliminar", teams);
            return res.status(404).json({ error: "No se han encontrado equipos para eliminar" })
        }

        return res.status(204).send();
    } catch {
        console.error("Ha ocurrido un error borrando los equipos de la base de datos");
        return res.status(500).json({ error: "Error borrando equipos de la base de datos" })
    }
}
//TODO: HACER CRUD DE TEAMS