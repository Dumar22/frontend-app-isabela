export interface WorkRegister{
    id?: string,
    registration: string,
    name: string,
    ot:string,
    address: string
    phone: string
  }
  export class WorkRegisterC{
    constructor(
    public id: string,
    public registration: string,
    public name: string,
    public ot:string,
    public address: string,
    public phone: string
    
    ){}
  }
  