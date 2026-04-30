import mongoose from "mongoose";
import { RoleStatus, RoleType, RoleVariant } from "./roles.types.js";
import db from "../../config/db.js";
import { Roles } from "./roles.model.js";

const seedData: Partial<RoleType>[] = [
    {
        name: "AGENTE",
        type: RoleVariant.AGENT,
        status: RoleStatus.ACTIVE,
        capabilities: ["profile.view.own", "sales.create"]
    },
    {
        name: "VALIDADOR",
        type: RoleVariant.VALIDATION_AGENT,
        status: RoleStatus.ACTIVE,
        capabilities: ["profile.view.own", "sales.create", "sales.view.all", "sales-validation.view.all"]
    },
    {
        name: "COORDINADOR",
        type: RoleVariant.TEAM_LEAD,
        status: RoleStatus.ACTIVE,
        capabilities: ["profile.view.all", "profile.view.own", "sales.create", "sales.edit", "sales.view.all", "sales-validation.view.all"],
    },
    {
        name: "RECURSOS HUMANOS",
        type: RoleVariant.RRHH,
        status: RoleStatus.ACTIVE,
        capabilities: ["profile.view.all", "profile.view.own", "profile.edit", "profile.create", "profile.delete"]
    },
    {
        name: "ADMINISTRADOR",
        type: RoleVariant.ADMIN,
        status: RoleStatus.ACTIVE,
        capabilities: ["profile.view.all", "profile.view.own", "profile.create", "profile.edit", "profile.delete", "sales.create", "sales.edit", "sales.view.all", "sales-validation.view.all"]
    }
];

mongoose
    .connect(db.DB_URL)
    .then(async () => {
        const allUsers = await Roles.find();

        if (allUsers.length) {
            console.log("Deleting Roles Collection...");
            await Roles.collection.drop();
        } else {
            console.log("No Roles Found, creating Roles...");
        }
    })
    .catch((error: unknown) => console.log("There was an error when deleting Roles.", error))
    .then(async () => {
        await Roles.insertMany(seedData);
        console.log("Roles added successfully!");
    })
    .catch((error: unknown) => console.log("Error adding Roles to database", error))
    .finally(() => mongoose.disconnect());