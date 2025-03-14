import { Role } from "../enums";
import { User } from "./schemas";

export type UserRole = Role.Admin | Role.User;

export const UserRoles = [Role.Admin, Role.User];

export interface UserWithoutPassword extends Omit<User, 'password'> { }

export interface IUser {
    _id?: string;
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    role: Role;
    createdAt?: Date;
    updatedAt?: Date;
    isDeleted?: boolean;
}
