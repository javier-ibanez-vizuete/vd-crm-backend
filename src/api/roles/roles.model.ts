import mongoose, { Schema } from "mongoose";
import { RoleStatus, RoleType, RoleVariant } from "./roles.types.js";

const rolesSchema: Schema<RoleType> = new Schema({
    name: {
        type: String,
        required: [true, "El campo name es obligatorio"],
        trim: true
    },
    type: {
        type: String,
        enum: Object.values(RoleVariant),
        required: [true, "El campo Rol es Obligatorio"],
        default: RoleVariant.AGENT,
        immutable: true,
        trim: true,
    },
    status: {
        type: String,
        enum: Object.values(RoleStatus),
        required: [true, "El campo status es obligatorio"],
        default: RoleStatus.ACTIVE,
        trim: true
    },
    capabilities: {
        type: [String],
        default: []
    }
});

export const Roles = mongoose.model("roles", rolesSchema);