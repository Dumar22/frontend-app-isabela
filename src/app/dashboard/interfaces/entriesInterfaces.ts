export interface Entries{
    id?:string,
    date: string,
    entryNumber: string,
    origin:string,
    providerName: string,
    providerNit: string,
    createDetailDto?: Material[],
    details?: Material[],
    file?:File
}

export interface Material{
    id?: string,
    name: string,
    code: string,
    unity: string,
    serial?: number,
    brand?: number,
    quantity: number,
    price: number,       
    total?: number,       
    observation: string,       
  }
  
 
  
  