export interface Entries{
    id?:string,
    date: string,
    entryNumber: string,
    origin:string,
    providerName: string,
    providerNit: string,
    materialEntryDetail: Material[],
}

export interface Material{
    id?: string,
    name: string,
    code: string,
    unity: string,
    state: boolean,
    quantity: number,
    serial: number,
    value: number,       
    total: number,       
    obs: string,       
  }
  
  export class InvoiceClass {
    constructor(
    public id:string,
     public date: string,
     public invoiceNumber: string,
     public origin:string,
     public providerName: string,
     public providerNit: string,
     public materials: Material[],   
   
    ) {}
  }
  