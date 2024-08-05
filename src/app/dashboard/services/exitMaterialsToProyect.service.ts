import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { WarehousesService } from './warehouses.service';
import { Observable } from 'rxjs';
import { PaginationResponse } from '../interfaces/exitInterfaces';
import { ExtiToProyect } from '../interfaces/exitMaterialToproyecInterface';

@Injectable({
  providedIn: 'root'
})
export class exitMaterialsToProyectService {

  baseUrl=environment.base_url


  constructor(
    private http: HttpClient, 
    private createHeaders: WarehousesService) { }

   getExit(limit: number, offset: number):Observable<PaginationResponse<ExtiToProyect>> {
    
    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString());

      const token = localStorage.getItem('token');
      let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${ token }`);
    
    
   return  this.http.get<PaginationResponse<ExtiToProyect>>(`${this.baseUrl}/exit-materials`, { params, headers});

   }


  getExitById(id:string):Observable<ExtiToProyect>{
    return this.http.get<ExtiToProyect>(`${this.baseUrl}/assing-materials-proyect/${id}`,this.createHeaders.createHeaders())
  }

  downloadPDF(id: string): Observable<ArrayBuffer> {
    const url = `${this.baseUrl}/assing-materials-proyect/pdf/${id}`;
    const headers = this.createHeaders.createHeaders();  // Asegúrate de incluir las cabeceras necesarias
  
    return this.http.get(url, { headers:headers.headers, responseType: 'arraybuffer' });
  }
  
  saveExit( exit: ExtiToProyect): Observable<ExtiToProyect>{
   return this.http.post<ExtiToProyect>(`${this.baseUrl}/assing-materials-proyect`, exit,this.createHeaders.createHeaders())
  }

  updateExit(id:string, exit:ExtiToProyect): Observable<void>{
    return this.http.patch<void>(`${this.baseUrl}/assing-materials-proyect/${id}`, exit, this.createHeaders.createHeaders())
  }

  deleteExit(exit: ExtiToProyect): Observable<ExtiToProyect>{
    return this.http.delete<ExtiToProyect>(`${this.baseUrl}/assing-materials-proyect/${exit.id}`,this.createHeaders.createHeaders());
  }


 
  searchExit(term: string): Observable<ExtiToProyect[]> {
    return this.http.get<ExtiToProyect[]>(`${this.baseUrl}/assing-materials-proyect/search/${term}`,this.createHeaders.createHeaders());
  }
}
