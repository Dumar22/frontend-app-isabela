import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Material } from '../interfaces/materialsInterface';
import { WarehousesService } from './warehouses.service';

@Injectable({
  providedIn: 'root'
})
export class MaterialsService {



  baseUrl=environment.base_url


  constructor(private http: HttpClient, private createHeaders: WarehousesService) { }

   getMaterials():Observable<Material[]> {
   return this.http.get<Material[]>(`${this.baseUrl}/materials`,this.createHeaders.createHeaders())

   }


  getMatrialById(id:string):Observable<Material>{
    return this.http.get<Material>(`${this.baseUrl}/material/${id}`,this.createHeaders.createHeaders())
  }

  saveMaterial( material: Material): Observable<Material>{
   return this.http.post<Material>(`${this.baseUrl}/material`, material,this.createHeaders.createHeaders())
  }

  updateMaterial(id:string, material:Material): Observable<void>{
    return this.http.put<void>(`${this.baseUrl}/material/${material.id}`, material,this.createHeaders.createHeaders())
  }

  deleteMaterial(material: Material): Observable<Material>{
    return this.http.delete<Material>(`${this.baseUrl}/material/${material.id}`,this.createHeaders.createHeaders());
  }






}
