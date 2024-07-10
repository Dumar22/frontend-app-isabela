import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Material } from '../interfaces/materialsInterface';
import { WarehousesService } from './warehouses.service';

@Injectable({
  providedIn: 'root'
})
export class ListExitMaterialsService {

  baseUrl=environment.base_url

  constructor(private http: HttpClient,
     private createHeaders: WarehousesService) { }     

   getMaterials():Observable<Material[]> {
   return this.http.get<Material[]>(`${this.baseUrl}/list-exit-materials`,this.createHeaders.createHeaders())

   }


  getMaterialById(id:string):Observable<Material>{
    return this.http.get<Material>(`${this.baseUrl}/list-exit-materials/${id}`,this.createHeaders.createHeaders())
  }

  saveMaterial( material: Material): Observable<Material>{
   return this.http.post<Material>(`${this.baseUrl}/list-exit-materials`, material,this.createHeaders.createHeaders())
  }

  updateMaterial(id:string, material:Material): Observable<void>{
    return this.http.patch<void>(`${this.baseUrl}/list-exit-materials/${id}`, material,this.createHeaders.createHeaders())
  }

  deleteMaterial(material: Material): Observable<Material>{
    return this.http.delete<Material>(`${this.baseUrl}/list-exit-materials/${material.id}`,this.createHeaders.createHeaders());
  }

 
}
