import { Warehouse } from "./warehouseInterface";

export class User {
constructor (
  public id: string,
  public fullName: string,
  public user: string,
  public isActive: boolean,
  public rol: string[],
  public warehouses: Warehouse[]
) {}
}

export interface UserForm {
  id?: string,
  fullName: string,
  user: string,
  password?:string,
  isActive?: boolean,
  rol: string[],
  warehouseIds: Warehouse[],
  
}


export interface LoadUser {
  total: number;
  users: User[];
}
