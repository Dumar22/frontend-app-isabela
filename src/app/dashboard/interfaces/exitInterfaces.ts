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
  
 
  