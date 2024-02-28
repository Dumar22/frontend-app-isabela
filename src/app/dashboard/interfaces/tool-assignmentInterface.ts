export interface ToolAssignment {
    id?: string,
    reason:         string;
    collaboratorId: string;
    assignmentNumber?: number;
    collaborator?:  Collaborator;
    observation?:   string;
    assignedAt?:     Date;
    details:        any[];
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

export interface DetailsTools{
    tooId: Tool
    assignedQuantity: number;
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