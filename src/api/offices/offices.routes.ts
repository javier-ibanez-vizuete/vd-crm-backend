import { Router } from "express";
import { createOffice, deleteOneOffice, getAllOffices, getOneOffice } from "./offices.controller.js";

export const officesRoutes: Router = Router();

officesRoutes.get("/", getAllOffices);

officesRoutes.get("/:id", getOneOffice);

officesRoutes.post("/", createOffice);

officesRoutes.patch("/:id/delete", deleteOneOffice)