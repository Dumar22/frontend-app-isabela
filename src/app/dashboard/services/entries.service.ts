import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { WarehousesService } from './warehouses.service';
import { Entries } from '../interfaces/entriesInterfaces';

@Injectable({
  providedIn: 'root'
})
export class EntriesService {

  baseUrl=environment.base_url


  constructor(private http: HttpClient, private createHeaders: WarehousesService) { }

   getEntries():Observable<Entries[]> {
    
   return  this.http.get<Entries[]>(`${this.baseUrl}/entries`, this.createHeaders.createHeaders())

   }


  getEntryById(id:string):Observable<Entries>{
    return this.http.get<Entries>(`${this.baseUrl}/entries/${id}`,this.createHeaders.createHeaders())
  }
  
  downloadEntryPDF(id: string) {

    const headers = this.createHeaders.createHeaders();
    return this.http.get(`${this.baseUrl}/dowload-entries/${id}`, {
      headers: headers.headers,
       responseType: 'blob' 
    });
  }

  saveEntry( entry: Entries): Observable<Entries>{
   return this.http.post<Entries>(`${this.baseUrl}/entries`, entry,this.createHeaders.createHeaders())
  }

  updateEntry(id:string, entry:Entries): Observable<void>{
    return this.http.patch<void>(`${this.baseUrl}/entries/${id}`, entry, this.createHeaders.createHeaders())
  }

  deleteEntry(entry: Entries): Observable<Entries>{
    return this.http.delete<Entries>(`${this.baseUrl}/entries/${entry.id}`,this.createHeaders.createHeaders());
  }

  
}
