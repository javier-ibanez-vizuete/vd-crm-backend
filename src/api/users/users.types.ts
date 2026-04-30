import { ObjectId } from "mongoose";
import { RoleType } from "../roles/roles.types.js";
import { TeamType } from "../teams/teams.types.js";

export type UserInfoType = Pick<UserType, "id" | "email" | "name" | "office" | "team">

export enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BANNED = "BANNED",
}

export type UserType = {
    id: ObjectId
    name: string;
    lastName: string;
    nif: string;
    email: string;
    emailToSave: string;
    password: string;
    role: RoleType | ObjectId;
    status: UserStatus;
    points?: number;
    manager?: ObjectId | UserInfoType;
    team?: ObjectId | TeamType;
    office: string; //TODO: PONER TIPO OFICINA CUANDO SE CREE EL TIPO OFFICE
    capabilities?: string[];
    isDeleted: boolean
}