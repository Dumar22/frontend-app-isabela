import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WarehousesService } from './warehouses.service';
import {  WorkRegister } from '../interfaces/workRegisterInterface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkRegisterService {

  baseUrl=environment.base_url



  constructor( private http: HttpClient,
    private createHeaders: WarehousesService) { }


  getWorkRegister():Observable<WorkRegister[]> {
    return this.http.get<WorkRegister[]>(`${this.baseUrl}/workinstall`, this.createHeaders.createHeaders())

    }


   getWorkRegisterById(id:string):Observable<WorkRegister>{
     return this.http.get<WorkRegister>(`${this.baseUrl}/workinstall/${id}`, this.createHeaders.createHeaders())
   }

   saveWorkRegister( workinstall: WorkRegister): Observable<WorkRegister>{
    return this.http.post<WorkRegister>(`${this.baseUrl}/workinstall`, workinstall,  this.createHeaders.createHeaders())
   }

   updateWorkRegister(id:string, workinstall:WorkRegister): Observable<void>{
     return this.http.put<void>(`${this.baseUrl}/workinstall/${workinstall.id}`, workinstall,  this.createHeaders.createHeaders())
   }

   deleteWorkRegister(workinstall: WorkRegister): Observable<WorkRegister>{
     return this.http.delete<WorkRegister>(`${this.baseUrl}/workinstall/${workinstall.id}`,  this.createHeaders.createHeaders());
   }
}
