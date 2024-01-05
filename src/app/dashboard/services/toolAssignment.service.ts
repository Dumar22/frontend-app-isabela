import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { WarehousesService } from './warehouses.service';
import { ToolAssignment } from '../interfaces/tool-assignmentInterface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToolAssignmentService {

  baseUrl=environment.base_url


  constructor(private http: HttpClient,
     private createHeaders: WarehousesService) { }
     

   getToolsAssignment():Observable<ToolAssignment[]> {
   return this.http.get<ToolAssignment[]>(`${this.baseUrl}/tool-asignament`,this.createHeaders.createHeaders())

   }


  getToolAssignmentById(id:string):Observable<ToolAssignment>{
    return this.http.get<ToolAssignment>(`${this.baseUrl}/tool-asignament/${id}`,this.createHeaders.createHeaders())
  }

  saveToolAssignment( toolAssignment: ToolAssignment): Observable<ToolAssignment>{
   return this.http.post<ToolAssignment>(`${this.baseUrl}/tool-asignament`, toolAssignment,this.createHeaders.createHeaders())
  }

  updateToolAssignment(id:string, toolAssignment:ToolAssignment): Observable<void>{
    return this.http.patch<void>(`${this.baseUrl}/tool-asignament/${id}`, toolAssignment,this.createHeaders.createHeaders())
  }

  deleteToolAssignment(toolAssignment: ToolAssignment): Observable<ToolAssignment>{
    return this.http.delete<ToolAssignment>(`${this.baseUrl}/tool-asignament/${toolAssignment.id}`,this.createHeaders.createHeaders());
  }
  

downloadPDF(toolAssignment: ToolAssignment): Observable<ToolAssignment>{
  return this.http.delete<ToolAssignment>(`${this.baseUrl}/tool-asignament/${toolAssignment.id}`,this.createHeaders.createHeaders());
}

  


}
