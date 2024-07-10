import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { WarehousesService } from './warehouses.service';
import { Observable } from 'rxjs';
import { Proyect } from '../interfaces/proyectsInterface';

@Injectable({
  providedIn: 'root'
})
export class ProyectsService {

  baseUrl=environment.base_url


  constructor(private http: HttpClient,
     private createHeaders: WarehousesService) { }
     

   getProyects():Observable<Proyect[]> {
   return this.http.get<Proyect[]>(`${this.baseUrl}/proyects`,this.createHeaders.createHeaders())

   }


  getProyectById(id:string):Observable<Proyect>{
    return this.http.get<Proyect>(`${this.baseUrl}/proyects/${id}`,this.createHeaders.createHeaders())
  }

  saveProyect( proyect: Proyect): Observable<Proyect>{
   return this.http.post<Proyect>(`${this.baseUrl}/proyects`, proyect,this.createHeaders.createHeaders())
  }

  updateProyect(id:string, proyect:Proyect): Observable<void>{
    return this.http.patch<void>(`${this.baseUrl}/proyects/${id}`, proyect,this.createHeaders.createHeaders())
  }

  deleteTool(proyect: Proyect): Observable<Proyect>{
    return this.http.delete<Proyect>(`${this.baseUrl}/proyects/${proyect.id}`,this.createHeaders.createHeaders());
  }

  searchProyect(term: string): Observable<Proyect[]> {
    return this.http.get<Proyect[]>(`${this.baseUrl}/proyects/search/${term}`,this.createHeaders.createHeaders());
  }
  
  


}
