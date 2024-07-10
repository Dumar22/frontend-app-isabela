export interface Provider{
  id?: string,
  name: string,
  nit: string,
}
export class ProviderC{
  constructor(
  public id: string,
  public name: string,
  public nit: string,
  
  ){}
}
