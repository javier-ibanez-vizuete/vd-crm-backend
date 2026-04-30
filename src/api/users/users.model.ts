import mongoose, { Schema } from "mongoose";
import { UserStatus, UserType } from "./users.types.js";

const userSchema: Schema<UserType> = new Schema({
    name: {
        type: String,
        required: [true, "El campo 'Nombre' es obligatorio"]
    },
    lastName: {
        type: String,
        required: [true, "El campo 'Apellido' es obligatorio"]
    },
    nif: {
        type: String,
        required: [true, "El campo 'DNI' es obligatorio"]
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "El formato del campo 'correo electrónico' no es valido"],
        required: [true, "El campo 'correo electrónico' es obligatorio"],
        minLength: [5, "El campo 'correo electrónico' es demasiado corto 'min:5'"],
        maxLength: [50, "El campo 'correo electrónico es demasiado largo 'max:50'"]
    },
    emailToSave: {
        type: String,
        index: true,
        select: false,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "El formato del campo 'correo electrónico' no es valido"],
        required: [true, "El campo 'correo electrónico' es obligatorio"],
        minLength: [5, "El campo 'correo electrónico' es demasiado corto 'min:5'"],
        maxLength: [50, "El campo 'correo electrónico es demasiado largo 'max:50'"]
    },
    password: {
        type: String,
        select: false,
        trim: true,
        minLength: [8, "Campo contraseña demasiado corto 'min:8'"],
        maxLength: [50, "Campo contraseña demasiado largo 'max:50'"]
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: "roles",
        required: [true, "El campo Role es Obligatorio"]
    },
    status: {
        type: String,
        required: [true, "Falta el campo Status"],
        enum: Object.values(UserStatus)
    },
    points: {
        type: Number,
        default: 0,
        min: 0,
    },
    manager: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    team: {
        type: Schema.Types.ObjectId,
        ref: "teams"
    },
    office: {
        type: String //TODO: PONER TIPO OFFICE CUANDO SE CREE EL TIPO OFFICE
    },
    capabilities: {
        type: [String],
        lowercase: true,
        default: []
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

export const Users = mongoose.model("users", userSchema)