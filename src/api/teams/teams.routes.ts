import { Router } from "express";
import { addTeam, addTeamMembers, editTeamName, editTeamResponsible, getAllTeams, getOneTeam, editTeamMembers, deleteTeamMembers, deleteOneTeam, deleteAllTeams } from "./teams.controller.js";

export const teamsRoutes: Router = Router();

teamsRoutes.get("/", getAllTeams);

teamsRoutes.get("/:id", getOneTeam);

teamsRoutes.post("/", addTeam);

teamsRoutes.post("/:id/add-team-members", addTeamMembers);

teamsRoutes.patch("/:id/edit-team-name", editTeamName);

teamsRoutes.patch("/:id/edit-team-responsible/:responsibleId", editTeamResponsible);

teamsRoutes.put("/:id/edit-team-members", editTeamMembers);

teamsRoutes.delete("/:id/delete-team-members", deleteTeamMembers);

teamsRoutes.delete("/:id", deleteOneTeam);

teamsRoutes.delete("/", deleteAllTeams);