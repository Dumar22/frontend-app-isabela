

export interface LoginResponse{
    message:   string;
    user: Userlog;
    token:     string;
}

export interface Userlog {
    id:        string;
    fullName:  string;
    user:      string;
    rol:       string[]; 
    warehouses: string[];   
    isActive?:    boolean;
  
}