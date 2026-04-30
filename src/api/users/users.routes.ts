import { Router } from "express";
import { UserType } from "./users.types.js";
import { getAllUsers } from "./users.controller.js";

export const usersRoutes: Router = Router();

usersRoutes.get("/", getAllUsers)