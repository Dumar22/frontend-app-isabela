import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { WarehousesService } from './warehouses.service';
import { Observable } from 'rxjs';
import { Proyections } from '../interfaces/proyectionsInterfaces';

@Injectable({
  providedIn: 'root'
})
export class ProyectionsService {

  baseUrl=environment.base_url

  constructor(private http: HttpClient, private createHeaders: WarehousesService) { }

  getProyection():Observable<Proyections[]> {
    
    return  this.http.get<Proyections[]>(`${this.baseUrl}/proyections`, this.createHeaders.createHeaders())
 
    }
 
 
   getProyectionById(id:string):Observable<Proyections>{
     return this.http.get<Proyections>(`${this.baseUrl}/proyections/${id}`,this.createHeaders.createHeaders())
   }
   
   downloadPDF(id: string): Observable<ArrayBuffer> {
     const url = `${this.baseUrl}/proyections/pdf/${id}`;
     const headers = this.createHeaders.createHeaders();  // Asegúrate de incluir las cabeceras necesarias
   
     return this.http.get(url, { headers:headers.headers, responseType: 'arraybuffer' });
   }
 
   saveProyection( proyect: Proyections): Observable<Proyections>{
    return this.http.post<Proyections>(`${this.baseUrl}/proyections`, proyect,this.createHeaders.createHeaders())
   }
 
   saveProyectionFile(proyection: Proyections, file: File): Observable<Proyections> {
     const formData = new FormData();
     const url = `${this.baseUrl}/proyections/upload-excel`;
     const headers = this.createHeaders.createHeaders();
     formData
     return this.http.post<Proyections>(url, formData,{headers:headers.headers} )
       // Asegúrate de configurar correctamente cualquier otra opción que necesites para la solicitud
     };
  
 
   updateProyection(id:string, proyection:Proyections): Observable<void>{
     return this.http.patch<void>(`${this.baseUrl}/proyections/${id}`, proyection, this.createHeaders.createHeaders())
   }
 
   deleteProyection(proyection: Proyections): Observable<Proyections>{
     return this.http.delete<Proyections>(`${this.baseUrl}/proyections/${proyection.id}`,this.createHeaders.createHeaders());
   }
 
   searchProyection(term: string): Observable<Proyections[]> {
     return this.http.get<Proyections[]>(`${this.baseUrl}/proyections/search/${term}`,this.createHeaders.createHeaders());
   }

}
