import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Collaborator, CollaboratorClass, LoadCollaborator } from '../interfaces/collaboratorInterface';
import { Observable, map } from 'rxjs';
import { WarehousesService } from './warehouses.service';

@Injectable({
  providedIn: 'root'
})
export class CollaboratorService {

  baseUrl=environment.base_url



  constructor( private http: HttpClient, private createHeaders: WarehousesService) { }



  loadCollaborators(desde: number = 0) {

    const url = `${ this.baseUrl }/collaborators?desde=${ desde }`;

    return this.http.get<LoadCollaborator>(url,this.createHeaders.createHeaders())
    .pipe(
      map( resp => {
        const collaborator = resp.collaborator.map(
          collaborator => new CollaboratorClass(
            collaborator.id, collaborator.code, collaborator.name, collaborator.operation, collaborator.document, collaborator.phone, collaborator.state, collaborator.warehouse )
        );
        return {
          collaborator,
          total: resp.total
        };

      })
    )


    }
  getCollaborators():Observable<Collaborator[]> {
    return this.http.get<Collaborator[]>(`${this.baseUrl}/collaborators`,this.createHeaders.createHeaders())

    }


   getCollaboratorById(id:string):Observable<Collaborator>{
     return this.http.get<Collaborator>(`${this.baseUrl}/collaborator/${id}`,this.createHeaders.createHeaders())
   }

   saveCollaborator( collaborator: Collaborator): Observable<Collaborator>{
    return this.http.post<Collaborator>(`${this.baseUrl}/collaborator`, collaborator,this.createHeaders.createHeaders())
   }

   updateCollaborator(id:string, collaborator:Collaborator): Observable<void>{
     return this.http.put<void>(`${this.baseUrl}/collaborator/${collaborator.id}`, collaborator,this.createHeaders.createHeaders())
   }

   deleteCollaborator(collaborator: Collaborator): Observable<Collaborator>{
     return this.http.delete<Collaborator>(`${this.baseUrl}/collaborator/${collaborator.id}`,this.createHeaders.createHeaders());
   }

   loadingCollaborators(file: File): Observable<number> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const headers = this.createHeaders.createHeaders();
    return this.http.post(`${this.baseUrl}/collaborators/upload`, formData, {
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
