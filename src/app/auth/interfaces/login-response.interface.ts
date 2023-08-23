

export interface LoginResponse{
    message:   string;
    userexist: Userlog;
    token:     string;
}

export interface Userlog {
    id:        string;
    name:      string;
    user:      string;
    rol:       string; 
    warehouse: string;   
    status:    boolean;
  
}