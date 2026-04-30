import { ObjectId } from "mongoose";

export enum RoleStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}

export enum RoleVariant {
    AGENT = "AGENT",
    VALIDATION_AGENT = "VALIDATION AGENT",
    TEAM_LEAD = "TEAM LEAD",
    RRHH = "RRHH",
    ADMIN = "ADMIN"
}

export type RoleType = {
    id: ObjectId;
    name: string;
    type: RoleVariant;
    status: RoleStatus;
    capabilities: string[];
}