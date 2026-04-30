import mongoose from "mongoose";
import { Roles } from "../roles/roles.model.js";
import { UserStatus, UserType } from "./users.types.js";
import db from "../../config/db.js";
import { Users } from "./users.model.js";
import { RoleVariant } from "../roles/roles.types.js";
import { Teams } from "../teams/teams.model.js";
import { teamsRoutes } from "../teams/teams.routes.js";

mongoose
    .connect(db.DB_URL)
    .then(async () => {
        const roles = await Roles.find();

        const adminRole = roles.find((role) => role.type === RoleVariant.ADMIN);
        const rrhhRole = roles.find((role) => role.type === RoleVariant.RRHH);
        const teamLeadRole = roles.find((role) => role.type === RoleVariant.TEAM_LEAD);
        const validationAgentRole = roles.find((role) => role.type === RoleVariant.VALIDATION_AGENT);
        const agentRole = roles.find((role) => role.type === RoleVariant.AGENT)
        if (!adminRole || !rrhhRole || !teamLeadRole || !validationAgentRole || !agentRole) throw new Error("Hubo un error al obtener los Roles");

        const teams = await Teams.find();

        const madrid1 = teams.find((team) => team.name === "TEAM MADRID 1");
        const madrid2 = teams.find((team) => team.name === "TEAM MADRID 2");
        const colombia1 = teams.find((team) => team.name === "TEAM COLOMBIA 1");
        const colombia2 = teams.find((team) => team.name === "TEAM COLOMBIA 2");

        if (!teams.length || !madrid1 || !madrid2 || !colombia1 || !colombia2) {
            console.error("No se han encontrado 'Equipos' para los usuarios");
            throw new Error("Hubo un Error al buscar Equipos para los usuarios")
        }

        const seedData: Partial<UserType>[] = [
            {
                name: "Javier",
                lastName: "Ibañez",
                nif: "49191145X",
                email: "javier.ibanez@vdenergy.es",
                emailToSave: "javieribanez@vdenergy.es",
                password: "Esunsecreto1993$",
                role: adminRole.id,
                status: UserStatus.ACTIVE,
                team: madrid1?.id,
                office: "MADRID"
            },
            {
                name: "Agente",
                lastName: "Prueba",
                nif: "49191144D",
                email: "agente.prueba@vdenergy.es",
                emailToSave: "agenteprueba@vdenergy.es",
                password: "contraseñaAgente",
                role: agentRole.id,
                status: UserStatus.ACTIVE,
                points: 0,
                team: madrid2,
                office: "MADRID"
            },
            {
                name: "Validador",
                lastName: "Prueba",
                nif: "49191143A",
                email: "validador.prueba@vdenergy.es",
                emailToSave: "validadorprueba@vdenergy.es",
                password: "contraseñaValidador",
                role: validationAgentRole.id,
                status: UserStatus.ACTIVE,
                points: 0,
                team: colombia1,
                office: "COLOMBIA"
            },
            {
                name: "Coordinador",
                lastName: "Prueba",
                nif: "49191142L",
                email: "coordinador.prueba@vdenergy.es",
                emailToSave: "coordinadorprueba@vdenergy.es",
                password: "contraseñaCoordinador",
                role: teamLeadRole.id,
                status: UserStatus.ACTIVE,
                points: 0,
                team: colombia2,
                office: "COLOMBIA"
            },
        ];

        const allUsers = await Users.find();

        if (allUsers.length) {
            console.log("Borrando Coleccion de Usuarios");
            await Users.collection.drop();
        }

        await Users.insertMany(seedData);
        console.log("Usuarios añadidos correctamente");

    })
    .catch((error: unknown) => {
        console.log("Error al", error);
    })
    .finally(() => {
        mongoose.disconnect()
        console.log("Desconectado de la base de datos")
    });