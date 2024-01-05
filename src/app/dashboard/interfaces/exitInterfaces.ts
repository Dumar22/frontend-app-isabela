export interface Exit{
    id?:string,
    date: string,
    exitNumber: string,
    warehouse:string,
    collaboratorCode: string,
    collaboratorName: string,
    collaboratorDocument: string,
    collaboratorOperation: string,    
    materialExitDetail: Material[],
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
  
  export class ExitC{
    constructor(
    public id:string,
    public date: string,
    public exitNumber: string,
    public warehouse:string,
    public collaboratorCode: string,
    public collaboratorName: string,
    public collaboratorDocument: string,
    public collaboratorOperation: string,    
    public materialExitDetail: Material[],
    ){}
  }
 
  