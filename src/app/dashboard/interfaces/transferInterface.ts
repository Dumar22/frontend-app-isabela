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
    materialTransferDetail: Material[],

}

export interface Material{
    id?: string,
    name: string,
    code: string,
    unity: string,
    state: boolean,
    quantity: number,
    restore:number,
    serial: number,
    value: number,       
    total: number,       
    obs: string,       
  }