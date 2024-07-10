export interface Invoice{
    id?:string,
    date: string,
    invoiceNumber: string,
    origin:string,
    providerName: string,
    providerNit: string,
    materials: Material[],
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
  