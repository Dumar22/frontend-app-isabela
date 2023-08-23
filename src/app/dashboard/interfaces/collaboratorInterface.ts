

export class CollaboratorClass {
  constructor(
      public id: string,
      public code: string,
      public name: string,
      public operation: string,
      public document:number,
      public phone:boolean,
      public state: boolean,
      public warehouse: string
  ) {}
}

// 
//administrador 1   BODEGA MANIZALES
export interface Collaborator{
  id?: string,
  code: string,
  name: string,
  operation: string,
  document:number,
  phone?:boolean,
  state: boolean,
  warehouse: string,
}

export interface LoadCollaborator{
  total: number;
  collaborator: CollaboratorClass[];
}
