import { Router } from "express";
import { addCapabilitiesToAllRoles, addCapabilitiesToOneRole, createOneRole, editOneRoleName, getAllRoles, getOneRole, removeCapabilitiesFromallRoles, removeCapabilitiesFromOneRole, toggleRoleStatus } from "./roles.controller.js";

export const rolesRoutes: Router = Router();

rolesRoutes.get("/", getAllRoles);

rolesRoutes.get("/:id", getOneRole);

rolesRoutes.post("/", createOneRole)

rolesRoutes.patch("/:id/edit-name", editOneRoleName)

rolesRoutes.patch("/:id/toggle-status-role", toggleRoleStatus)

rolesRoutes.patch("/:id/add-capabilities", addCapabilitiesToOneRole);

rolesRoutes.patch("/add-capabilities", addCapabilitiesToAllRoles);

rolesRoutes.patch("/:id/remove-capabilities", removeCapabilitiesFromOneRole)

rolesRoutes.patch("/remove-capabilities", removeCapabilitiesFromallRoles);