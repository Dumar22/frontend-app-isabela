import { Userlog } from "./login-response.interface";

export interface CheckTokenResponse {
    userexist:  Userlog;
    token: string;
  }