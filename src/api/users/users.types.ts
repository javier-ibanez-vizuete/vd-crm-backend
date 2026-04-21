import { ObjectId } from "mongoose";

export enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BANNED = "BANNED"
}

export type UserType = {
    id: ObjectId
    name: string;
    lastName: string;
    nif: string;
    email: string;
    password: string;
    role: string; //TODO: PONER TIPO ROLE CUANDO SE CREE
    status: UserStatus;
    points: number;
    team: string; //TODO: PONER TiPO TEAM PARCIAL CUANDO SE CREE EL TYPE TEAM
    office: string; //TODO: PONER TIPO OFICINA CUANDO SE CREE EL TIPO OFFICE
    capabilities: string[];
}