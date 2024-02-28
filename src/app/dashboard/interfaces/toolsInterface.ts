export interface Tools{
    id?: string,
    name: string,
    code: string,
    unity: string,
    quantity: number,
    price: number,      
    available: boolean,
   
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