import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { WarehousesService } from './warehouses.service';
import { Exit } from '../interfaces/exitInterfaces';

@Injectable({
  providedIn: 'root'
})
export class ExitService {

  baseUrl=environment.base_url


  constructor(
    private http: HttpClient, 
    private createHeaders: WarehousesService) { }

   getExit():Observable<Exit[]> {
    
   return  this.http.get<Exit[]>(`${this.baseUrl}/exit-materials`, this.createHeaders.createHeaders())

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
