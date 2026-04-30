import { ObjectId } from "mongoose"

export enum CountryVariants {
    SPAIN = "SPAIN",
    COLOMBIA = "COLOMBIA"
}

export type OfficeType = {
    id: ObjectId;
    name: string;
    nameToSave: string;
    country: CountryVariants;
    isDeleted: boolean;
}