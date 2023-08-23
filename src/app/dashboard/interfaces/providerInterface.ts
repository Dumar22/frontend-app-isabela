export interface Provider{
  id?: string,
  name: string,
  nit: string,
  ally?:boolean
  warehouse: string
}
export class ProviderC{
  constructor(
  public id: string,
  public name: string,
  public nit: string,
  
  ){}
}
