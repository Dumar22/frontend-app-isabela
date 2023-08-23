import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WarehousesService } from './warehouses.service';
import { Exit } from '../interfaces/exitInterfaces';

@Injectable({
  providedIn: 'root'
})
export class ExitService {

  baseUrl=environment.base_url


  constructor(private http: HttpClient, private createHeaders: WarehousesService) { }

   getExit():Observable<Exit[]> {
    
   return  this.http.get<Exit[]>(`${this.baseUrl}/exit`, this.createHeaders.createHeaders())

   }


  getExitById(id:string):Observable<Exit>{
    return this.http.get<Exit>(`${this.baseUrl}/exit/${id}`,this.createHeaders.createHeaders())
  }
  downloadExitPDF(id: string) {
    return this.http.get(`${this.baseUrl}/dowload-exit/${id}`, {
      responseType: 'blob' 
    });
  }

  saveExit( exit: Exit): Observable<Exit>{
   return this.http.post<Exit>(`${this.baseUrl}/exit`, exit,this.createHeaders.createHeaders())
  }

  updateExit(id:string, exit:Exit): Observable<void>{
    return this.http.put<void>(`${this.baseUrl}/exit/${exit.id}`, exit, this.createHeaders.createHeaders())
  }

  deleteExit(exit: Exit): Observable<Exit>{
    return this.http.delete<Exit>(`${this.baseUrl}/exit/${exit.id}`,this.createHeaders.createHeaders());
  }

  
}
