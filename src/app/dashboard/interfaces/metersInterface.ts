export interface Meter{
    id?: string,
    name: string,
    code: string,
    unity: string,
    quantity: number,
    price: number,  
    serial: string,
    brand: string,
    available: boolean,
   
  }
  
  export class MeterClass {
    constructor(
      public id: string,
      public name: string,
      public code: string,
      public unity: string,
      public quantity: number,
      public value: number,
      public serial: string,    
      public brand: string,    
      public available: boolean,
  
    ) {}
  }
  