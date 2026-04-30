import mongoose, { Schema } from "mongoose";
import { TeamType } from "./teams.types.js";

const teamsSchema: Schema<TeamType> = new Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "El campo name es obligatorio"]
    },
    nameToSave: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        index: true,
        select: false,
        required: [true, "El campo Nombre para guardar es obligatorio"],
    },
    responsible: {
        type: Schema.Types.ObjectId,
        ref: "users",
    },
    members: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "users"
        }],
        default: []
    },
    isDeleted: {
        type: Boolean,
        select: false,
        default: false
    }
})

export const Teams = mongoose.model("teams", teamsSchema)