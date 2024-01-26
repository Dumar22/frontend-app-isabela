import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { WarehousesService } from './warehouses.service';
import {  WorkRegister } from '../interfaces/workRegisterInterface';
import { Observable, map } from 'rxjs';
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

   searchWorkRegister(term: string): Observable<WorkRegister[]> {
    return this.http.get<WorkRegister[]>(`${this.baseUrl}/contract/search/${term}`,this.createHeaders.createHeaders());
  }


   loadWorkRegister(file: File): Observable<number> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const headers = this.createHeaders.createHeaders();
    return this.http.post(`${this.baseUrl}/contract/upload-excel`, formData, {
      headers: headers.headers,
      reportProgress: true,
      observe: 'events' // Agrega esta línea para especificar el tipo de observación
    }).pipe(
      map((event: HttpEvent<any>) => this.calculateUploadProgress(event))
    );
  }

  private calculateUploadProgress(event: HttpEvent<any>): number {
    if (event.type === HttpEventType.UploadProgress) {
      const progress = Math.round((100 * event.loaded) / event.total);
      return progress;
    }
    return 0;
  }

   public isValidField( form: FormGroup, field: string ) {

    return form.controls[field].errors && form.controls[field].touched;

  }
}
