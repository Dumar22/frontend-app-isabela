import { Userlog } from "./login-response.interface";

export interface CheckTokenResponse {
    user:  Userlog;
    token: string;
  }