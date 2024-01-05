

export class CollaboratorClass {
  constructor(
      public id: string,
      public code: string,
      public name: string,
      public operation: string,
      public document:number,
      public phone:string,
      public mail:string,
      public status?: boolean
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
  phone?:string,
  mail?:string,
  status?: boolean
}

export interface LoadCollaborator{
  total: number;
  collaborator: CollaboratorClass[];
}
