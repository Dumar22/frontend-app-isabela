export interface MaterialVehicle {
    id?:            string,
    date:           string;
    reason:         string;
    observation?:    string;
    collaboratorId: string;
    collaborator?:   Collaborator;
    vehicleId:      string;
    vehicle?:        Vehicle;
    details:        Detail[];
}

export interface Detail {
    materialId:       string;
    material:       Material;
    assignedQuantity: number;
    observation:      string;
    assignedAt:       string;
}

export interface Collaborator {
    id:        string;
    name:      string;
    code:      string;
    operation: string;
    document:  number;
    phone:     number;
    mail:      string;
    status:    boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedBy: null;
    deletedAt: null;
}

export interface Material {
    id:          string;
    name:        string;
    code:        string;
    unity:       string;
    quantity:    number;
    price:       number;
    available:   boolean;
    total:       number;
    observation: null;
    createdAt:   Date;
    updatedAt:   Date;
    deletedBy:   null;
    deletedAt:   null;
}
export interface Vehicle{
    id?: string,
    make: string,
    model: string,
    plate: string,
    status?:boolean
    warehouses?: string[]
  }