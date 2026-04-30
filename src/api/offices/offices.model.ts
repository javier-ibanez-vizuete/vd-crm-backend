import mongoose, { Schema } from "mongoose";
import { CountryVariants, OfficeType } from "./offices.types.js";

const officeSchema: Schema<OfficeType> = new Schema({
    name: {
        type: String,
        trim: true,
        immutable: true,
        required: [true, "El campo nombre es obligatorio"]
    },
    nameToSave: {
        type: String,
        trim: true,
        immutable: true,
        unique: [true, "Esta oficina ya existe"],
        index: true,
        lowercase: true,
        select: false,
        required: [true, "No se ha introducido el campo nombre para guardar"]
    },
    country: {
        type: String,
        enum: Object.values(CountryVariants),
        immutable: true,
        trim: true,
        required: [true, "El campo pais es obligatorio"]
    },
    isDeleted: {
        type: Boolean,
        default: false,
        select: false
    }
});

export const Offices = mongoose.model("offices", officeSchema)