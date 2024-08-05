
export interface ExtiToProyect{
    id?: string;
    date: Date; 
    observation?: string;  
    proyectId: string;
   details:DetailsExitToProyec[];
}


export interface DetailsExitToProyec{

    materialId: string;
    assignedQuantity: number;
    observation?: string;
    assignedAt: Date;
    returnedA?: Date;
    returnMaterials?: boolean;
}