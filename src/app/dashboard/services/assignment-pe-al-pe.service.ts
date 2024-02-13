import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { WarehousesService } from './warehouses.service';
import { MaterialPeAlPe } from '../interfaces/assignmentPeAlPinterface';

@Injectable({
  providedIn: 'root'
})
export class AssignmentPeAlPeService {

  baseUrl=environment.base_url


  constructor(private http: HttpClient,
     private createHeaders: WarehousesService) { }
     

   getMaterialPeAlPe():Observable<MaterialPeAlPe[]> {
   return this.http.get<MaterialPeAlPe[]>(`${this.baseUrl}/assignment-pe-al-pe`,this.createHeaders.createHeaders())

   }


  getMaterialPeAlPeById(id:string):Observable<MaterialPeAlPe>{
    return this.http.get<MaterialPeAlPe>(`${this.baseUrl}/assignment-pe-al-pe/${id}`,this.createHeaders.createHeaders())
  }

  saveMaterialPeAlPe( materialPeAlPe: MaterialPeAlPe): Observable<MaterialPeAlPe>{
   return this.http.post<MaterialPeAlPe>(`${this.baseUrl}/assignment-pe-al-pe`, materialPeAlPe,this.createHeaders.createHeaders())
  }

  updateMaterialPeAlPe(id:string, materialPeAlPe:MaterialPeAlPe): Observable<void>{
    return this.http.patch<void>(`${this.baseUrl}/assignment-pe-al-pe/${id}`, materialPeAlPe,this.createHeaders.createHeaders())
  }

  deleteMaterialPeAlPe(materialPeAlPe: MaterialPeAlPe): Observable<MaterialPeAlPe>{
    return this.http.delete<MaterialPeAlPe>(`${this.baseUrl}/assignment-pe-al-pe/${materialPeAlPe.id}`,this.createHeaders.createHeaders());
  }
  

  downloadPDF(id: string): Observable<ArrayBuffer> {
    const url = `${this.baseUrl}/assignment-pe-al-pe/pdf/${id}`;
    const headers = this.createHeaders.createHeaders();  // Asegúrate de incluir las cabeceras necesarias
  
    return this.http.get(url, { headers:headers.headers, responseType: 'arraybuffer' });
  }


}
