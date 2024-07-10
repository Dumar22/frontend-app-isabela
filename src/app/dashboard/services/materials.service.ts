import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { Material } from '../interfaces/materialsInterface';
import { WarehousesService } from './warehouses.service';

@Injectable({
  providedIn: 'root'
})
export class MaterialsService {

  baseUrl=environment.base_url

  constructor(private http: HttpClient,
     private createHeaders: WarehousesService) { }     

   getMaterials():Observable<Material[]> {
   return this.http.get<Material[]>(`${this.baseUrl}/materials`,this.createHeaders.createHeaders())

   }


  getMaterialById(id:string):Observable<Material>{
    return this.http.get<Material>(`${this.baseUrl}/materials/${id}`,this.createHeaders.createHeaders())
  }

  saveMaterial( material: Material): Observable<Material>{
   return this.http.post<Material>(`${this.baseUrl}/materials`, material,this.createHeaders.createHeaders())
  }

  updateMaterial(id:string, material:Material): Observable<void>{
    return this.http.patch<void>(`${this.baseUrl}/materials/${id}`, material,this.createHeaders.createHeaders())
  }

  deleteMaterial(material: Material): Observable<Material>{
    return this.http.delete<Material>(`${this.baseUrl}/materials/${material.id}`,this.createHeaders.createHeaders());
  }

  searchMaterial(term: string): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.baseUrl}/materials/search/${term}`,this.createHeaders.createHeaders());
  }


  
  loadMaterials(file: File): Observable<number> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const headers = this.createHeaders.createHeaders();
    return this.http.post(`${this.baseUrl}/materials/upload-excel`, formData, {
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




}
