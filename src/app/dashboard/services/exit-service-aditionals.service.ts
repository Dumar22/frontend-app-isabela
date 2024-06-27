import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { WarehousesService } from './warehouses.service';
import { Observable } from 'rxjs';
import { Exit } from '../interfaces/exitInterfaces';

@Injectable({
  providedIn: 'root'
})
export class ExitServiceAditionalsService {

  baseUrl=environment.base_url
//

  constructor(
    private http: HttpClient, 
    private createHeaders: WarehousesService) { }

   getExit():Observable<Exit[]> {
    
   return  this.http.get<Exit[]>(`${this.baseUrl}/exti-materials-aditionals-services`, this.createHeaders.createHeaders())

   }


  getExitById(id:string):Observable<Exit>{
    return this.http.get<Exit>(`${this.baseUrl}/exti-materials-aditionals-services/${id}`,this.createHeaders.createHeaders())
  }

  downloadPDF(id: string): Observable<ArrayBuffer> {
    const url = `${this.baseUrl}/exti-materials-aditionals-services/pdf/${id}`;
    const headers = this.createHeaders.createHeaders();  // Asegúrate de incluir las cabeceras necesarias
  
    return this.http.get(url, { headers:headers.headers, responseType: 'arraybuffer' });
  }
  
  saveExit( exit: Exit): Observable<Exit>{
   return this.http.post<Exit>(`${this.baseUrl}/exti-materials-aditionals-services`, exit,this.createHeaders.createHeaders())
  }

  updateExit(id:string, exit:Exit): Observable<void>{
    return this.http.patch<void>(`${this.baseUrl}/exti-materials-aditionals-services/${id}`, exit, this.createHeaders.createHeaders())
  }

  deleteExit(exit: Exit): Observable<Exit>{
    return this.http.delete<Exit>(`${this.baseUrl}/exti-materials-aditionals-services/${exit.id}`,this.createHeaders.createHeaders());
  }


 
  searchExit(term: string): Observable<Exit[]> {
    return this.http.get<Exit[]>(`${this.baseUrl}/exti-materials-aditionals-services/search/${term}`,this.createHeaders.createHeaders());
  }

}
