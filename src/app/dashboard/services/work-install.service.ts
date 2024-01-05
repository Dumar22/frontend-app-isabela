import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { WarehousesService } from './warehouses.service';
import {  WorkRegister } from '../interfaces/workRegisterInterface';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class WorkRegisterService {

  baseUrl=environment.base_url



  constructor( private http: HttpClient,
    private createHeaders: WarehousesService) { }


  getWorkRegister():Observable<WorkRegister[]> {
    return this.http.get<WorkRegister[]>(`${this.baseUrl}/contract`, this.createHeaders.createHeaders())

    }

   getWorkRegisterById(id:string):Observable<WorkRegister>{
     return this.http.get<WorkRegister>(`${this.baseUrl}/contract/${id}`, this.createHeaders.createHeaders())
   }

   saveWorkRegister( contract: WorkRegister): Observable<WorkRegister>{
    return this.http.post<WorkRegister>(`${this.baseUrl}/contract`, contract,  this.createHeaders.createHeaders())
   }

   updateWorkRegister(id:string, contract:WorkRegister): Observable<void>{
     return this.http.patch<void>(`${this.baseUrl}/contract/${id}`, contract,  this.createHeaders.createHeaders())
   }

   deleteWorkRegister(contract: WorkRegister): Observable<WorkRegister>{
     return this.http.delete<WorkRegister>(`${this.baseUrl}/contract/${contract.id}`,  this.createHeaders.createHeaders());
   }

   public isValidField( form: FormGroup, field: string ) {

    return form.controls[field].errors && form.controls[field].touched;

  }
}
