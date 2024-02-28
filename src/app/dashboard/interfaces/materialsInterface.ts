export interface Material{
  id?: string,
  name: string,
  code: string,
  unity: string,
  serial?:string,
  quantity: number,
  price: number,  
  available: boolean,
  total?: number,
  observation?: string, 
}

export class MaterialClass {
  constructor(
    public id: string,
    public name: string,
    public code: string,
    public unity: string,
    public quantity: number,
    public price: number,
    public serial: string,    
    public available: boolean,

  ) {}
}
