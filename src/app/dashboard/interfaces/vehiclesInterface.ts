export interface Vehicle{
    id?: string,
    make: string,
    model: string,
    plate: string,
    status?:boolean
    warehouses?: string[]
  }
  export class VehicleC{
    constructor(
    public id: string,
    public make: string,
    public model: string,
    public plate: string,
    public status?: boolean
    ){}
  }