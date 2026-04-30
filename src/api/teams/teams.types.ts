import { ObjectId } from "mongoose"
import { UserInfoType } from "../users/users.types.js";

export type TeamType = {
    id: ObjectId;
    name: string;
    nameToSave: string;
    responsible?: ObjectId;
    members?: ObjectId[];
    isDeleted: boolean;
}