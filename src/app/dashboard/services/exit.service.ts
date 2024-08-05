import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { WarehousesService } from './warehouses.service';
import { Exit, PaginationResponse } from '../interfaces/exitInterfaces';

@Injectable({
  providedIn: 'root'
})
export class ExitService {

  baseUrl=environment.base_url


  constructor(
    private http: HttpClient, 
    private createHeaders: WarehousesService) { }

   getExit(limit: number, offset: number):Observable<PaginationResponse<Exit>> {
    
    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString());

      const token = localStorage.getItem('token');
      let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${ token }`);
    
    
   return  this.http.get<PaginationResponse<Exit>>(`${this.baseUrl}/exit-materials`, { params, headers});

   }


  getExitById(id:string):Observable<Exit>{
    return this.http.get<Exit>(`${this.baseUrl}/exit-materials/${id}`,this.createHeaders.createHeaders())
  }

  downloadPDF(id: string): Observable<ArrayBuffer> {
    const url = `${this.baseUrl}/exit-materials/pdf/${id}`;
    const headers = this.createHeaders.createHeaders();  // Asegúrate de incluir las cabeceras necesarias
  
    return this.http.get(url, { headers:headers.headers, responseType: 'arraybuffer' });
  }
  
  saveExit( exit: Exit): Observable<Exit>{
   return this.http.post<Exit>(`${this.baseUrl}/exit-materials`, exit,this.createHeaders.createHeaders())
  }

  updateExit(id:string, exit:Exit): Observable<void>{
    return this.http.patch<void>(`${this.baseUrl}/exit-materials/${id}`, exit, this.createHeaders.createHeaders())
  }

  deleteExit(exit: Exit): Observable<Exit>{
    return this.http.delete<Exit>(`${this.baseUrl}/exit-materials/${exit.id}`,this.createHeaders.createHeaders());
  }


 
  searchExit(term: string): Observable<Exit[]> {
    return this.http.get<Exit[]>(`${this.baseUrl}/exit-materials/search/${term}`,this.createHeaders.createHeaders());
  }
  
}
