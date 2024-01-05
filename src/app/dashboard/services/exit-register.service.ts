import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { WarehousesService } from './warehouses.service';
import { Observable } from 'rxjs';
import { ExitReg } from '../interfaces/exitRegisterInterface';

@Injectable({
  providedIn: 'root'
})
export class ExitRegisterService {

  baseUrl=environment.base_url


  constructor(private http: HttpClient, private createHeaders: WarehousesService) { }

   getExit():Observable<ExitReg[]> {
    
   return  this.http.get<ExitReg[]>(`${this.baseUrl}/exit-register`, this.createHeaders.createHeaders())

   }


  getExitById(id:string):Observable<ExitReg>{
    return this.http.get<ExitReg>(`${this.baseUrl}/exit-register/${id}`,this.createHeaders.createHeaders())
  }
 

  saveExit( exit: ExitReg): Observable<ExitReg>{
   return this.http.post<ExitReg>(`${this.baseUrl}/exit-register`, exit,this.createHeaders.createHeaders())
  }

  updateExit(id:string, exit:ExitReg): Observable<void>{
    return this.http.put<void>(`${this.baseUrl}/exit-register/${exit.id}`, exit, this.createHeaders.createHeaders())
  }

  deleteExit(exit: ExitReg): Observable<ExitReg>{
    return this.http.delete<ExitReg>(`${this.baseUrl}/exit-register/${exit.id}`,this.createHeaders.createHeaders());
  }

  downloadExitPDF(id: string) {

    const headers = this.createHeaders.createHeaders();
    return this.http.get(`${this.baseUrl}/dowload-exit-register/${id}`, {
      headers: headers.headers,
       responseType: 'blob' 
    });
  }
  

}
