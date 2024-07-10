export interface Tools{
    id?: string,
    name: string,
    code: string,
    unity: string,
    iva?: number,
    total_iva?: number,
    quantity?: number,
    price: number, 
    total?: number,     
    available: boolean,
    observation?: string,
   
  }
  
  export class ToolsClass {
    constructor(
      public id: string,
      public name: string,
      public code: string,
      public unity: string,
      public quantity: number,
      public value: number,
      public serial: string,    
      public available: boolean,
  
    ) {}
  }