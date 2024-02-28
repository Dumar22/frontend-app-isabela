export interface Transfers{
    id?: string,
    date: string,
    transferNumber: string,
    origin: string,
    destination: string,
    autorization: string,
    delivery: string,
    documentdelivery: string,
    receive: string,
    documentreceive: string,
    observation?: string;
    createDetailTransferDto?: Material[],
    details?: Material[],

}

export interface Material{
    id?: string,
    name: string,
    code: string;
    unity: string;
    serial: string;
    brand: string; 
    quantity: number;
    price: number;
    observation?: string;       
    total: number,  
    available: boolean,    
    obs?: string,       
  }