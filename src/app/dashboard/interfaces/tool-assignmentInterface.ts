export interface ToolAssignment {
    id?: string,
    date:           string;
    reason:         string;
    observation?:    string;
    collaboratorId: string;
    collaborator?:   Collaborator;
    details:        Detail[];

}

export interface Detail {
    toolID?:           string;
    tool?:             Tool;
    assignedQuantity: number;
    durabilityTool:   number;
    observation?:      string;
    assignedAt:       Date;
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

export interface Tool {
    id:          string;
    name:        string;
    code:        string;
    unity:       string;
    quantity:    number;
    price:       number;
    available:   boolean;
    total:       number;
    observation?: null;
    createdAt:   Date;
    updatedAt:   Date;
    deletedBy:   null;
    deletedAt:   null;
}