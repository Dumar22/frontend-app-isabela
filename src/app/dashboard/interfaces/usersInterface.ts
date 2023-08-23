
export class User {
constructor (
  public id: string,
  public name: string,
  public user: string,
  public status: boolean,
  public rol: string,
  public warehouse: string
) {}
}

export interface UserForm {
  id?: string,
  name: string,
  user: string,
  status: boolean,
  rol: string,
  warehouse: string,
  
}


export interface LoadUser {
  total: number;
  users: User[];
}
