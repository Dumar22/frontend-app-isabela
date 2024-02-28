

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
  document:string,
  phone?:string,
  mail?:string,
  status?: boolean
}

export interface LoadCollaborator{
  total: number;
  collaborator: CollaboratorClass[];
}


export const ColaboratorOperation = [
{ value: 'AUXILIAR DE BODEGA' },
{ value: 'AUXILIAR DE BODEGA Y MENSAJERO' },
{ value: 'AUXILIAR DE BODEGA Y PROGRAMADOR' },
{ value: 'AUXILIAR DE INGENIERIA' },
{ value: 'AUXILIAR DE INSTALACION'},
{ value: 'AUXILIAR DE SERVICIO'},
{ value: 'CONDUCTOR'},
{ value: 'COORDINADOR DE SERVICIOS ASOCIADOS' },
{ value: 'COORDINADORA SST' },
{ value: 'DIRECTOR TALENTO HUMANO'},
{ value: 'JEFE DE BODEGA' },
{ value: 'PEGADOR' },
{ value: 'RESIDENTE DE OBRA' },
{ value: 'SUPERVISOR'},
{ value: 'SUPERVISOR PEGADOR' },
{ value: 'TECNICO INSTALADOR' },
{ value: 'TECNICO INSTALADOR REDES INTERNAS' },
{ value: 'TECNICO INSTALADOR SERVICIOS ASOCIADOS' },

]