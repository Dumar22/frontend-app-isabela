import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { Tools } from '../interfaces/toolsInterface';
import { WarehousesService } from './warehouses.service';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {



  baseUrl=environment.base_url


  constructor(private http: HttpClient,
     private createHeaders: WarehousesService) { }
     

   getTools():Observable<Tools[]> {
   return this.http.get<Tools[]>(`${this.baseUrl}/tools`,this.createHeaders.createHeaders())

   }


  getToolById(id:string):Observable<Tools>{
    return this.http.get<Tools>(`${this.baseUrl}/tools/${id}`,this.createHeaders.createHeaders())
  }

  saveTool( tool: Tools): Observable<Tools>{
   return this.http.post<Tools>(`${this.baseUrl}/tools`, tool,this.createHeaders.createHeaders())
  }

  updateTool(id:string, tool:Tools): Observable<void>{
    return this.http.patch<void>(`${this.baseUrl}/tools/${id}`, tool,this.createHeaders.createHeaders())
  }

  deleteTool(tool: Tools): Observable<Tools>{
    return this.http.delete<Tools>(`${this.baseUrl}/tools/${tool.id}`,this.createHeaders.createHeaders());
  }

  searchTool(term: string): Observable<Tools[]> {
    return this.http.get<Tools[]>(`${this.baseUrl}/tools/search/${term}`,this.createHeaders.createHeaders());
  }
  
  loadTools(file: File): Observable<number> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const headers = this.createHeaders.createHeaders();
    return this.http.post(`${this.baseUrl}/tools/upload-excel`, formData, {
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

