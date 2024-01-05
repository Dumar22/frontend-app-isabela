export interface WorkRegister{
    id?: string,
    name: string,
    addres: string
    registration: string,
    ot: string,
    phone: string
    observation?: string
  }
  export class WorkRegisterC{
    constructor(
    public id: string,
    public registration: string,
    public name: string,
    public ot: string,
    public address: string,
    public phone: string
    
    ){}
  }
  