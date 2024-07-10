import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { WarehousesService } from './warehouses.service';
import { Observable } from 'rxjs';
import { MaterialVehicle } from '../interfaces/assignmentMaterialsVehicleInterface';

@Injectable({
  providedIn: 'root'
})
export class AssignmentMaterialsVehicleService {

  baseUrl=environment.base_url


  constructor(private http: HttpClient,
     private createHeaders: WarehousesService) { }
     

   getToolsAssignment():Observable<MaterialVehicle[]> {
   return this.http.get<MaterialVehicle[]>(`${this.baseUrl}/assignment-materials-vehicle`,this.createHeaders.createHeaders())

   }


  getMaterialVehicleById(id:string):Observable<MaterialVehicle>{
    return this.http.get<MaterialVehicle>(`${this.baseUrl}/assignment-materials-vehicle/${id}`,this.createHeaders.createHeaders())
  }

  saveToolAssignment( materialVehicle: MaterialVehicle): Observable<MaterialVehicle>{
   return this.http.post<MaterialVehicle>(`${this.baseUrl}/assignment-materials-vehicle`, materialVehicle,this.createHeaders.createHeaders())
  }

  updateMaterialVehicle(id:string, materialVehicle:MaterialVehicle): Observable<void>{
    return this.http.patch<void>(`${this.baseUrl}/assignment-materials-vehicle/${id}`, materialVehicle,this.createHeaders.createHeaders())
  }

  deleteMaterialVehicle(materialVehicle: MaterialVehicle): Observable<MaterialVehicle>{
    return this.http.delete<MaterialVehicle>(`${this.baseUrl}/assignment-materials-vehicle/${materialVehicle.id}`,this.createHeaders.createHeaders());
  }
  

  downloadPDF(id: string): Observable<ArrayBuffer> {
    const url = `${this.baseUrl}/assignment-materials-vehicle/pdf/${id}`;
    const headers = this.createHeaders.createHeaders();  // Asegúrate de incluir las cabeceras necesarias
  
    return this.http.get(url, { headers:headers.headers, responseType: 'arraybuffer' });
  }

}
