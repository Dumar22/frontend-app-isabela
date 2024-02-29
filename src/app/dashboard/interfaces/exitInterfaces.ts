export interface Exit {
  id?:           string;
  ExitNumber?:   number;
  date:         string;
  type:         string;
  observation?:  string; 
  collaborator?: Collaborator;
  collaboratorId?: string;
  contract?:     Contract;
  contractId?:     string;
  state:     string;
  details?:      any[];
  newDetails?:      any[];
 
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

export interface Contract {
  id:           string;
  contract: string;
  name:         string;
  ot:           string;
  request:       string;
  addres:       string;
  phone:        string;
  observation:  null;
  createdAt:    Date;
  updatedAt:    Date;
  deletedBy:    null;
  deletedAt:    null;
}

export interface User {
  rol:       string[];
  id:        string;
  user:      string;
  fullName:  string;
  isActive:  boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Warehouse {
  id:        string;
  name:      string;
  createdAt: Date;
  updatedAt: Date;
}
