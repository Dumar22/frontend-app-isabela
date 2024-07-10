import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { WarehousesService } from './warehouses.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entries } from '../interfaces/entriesInterfaces';

@Injectable({
  providedIn: 'root'
})
export class EntriesToolsService {

  baseUrl=environment.base_url


  constructor(private http: HttpClient, private createHeaders: WarehousesService) { }

   getEntries():Observable<Entries[]> {
    
   return  this.http.get<Entries[]>(`${this.baseUrl}/entries-tools`, this.createHeaders.createHeaders())

   }


  getEntryById(id:string):Observable<Entries>{
    return this.http.get<Entries>(`${this.baseUrl}/entries-tools/${id}`,this.createHeaders.createHeaders())
  }
  
  downloadPDF(id: string): Observable<ArrayBuffer> {
    const url = `${this.baseUrl}/entries-tools/pdf/${id}`;
    const headers = this.createHeaders.createHeaders();  // Asegúrate de incluir las cabeceras necesarias
  
    return this.http.get(url, { headers:headers.headers, responseType: 'arraybuffer' });
  }

  saveEntry( entry: Entries): Observable<Entries>{
   return this.http.post<Entries>(`${this.baseUrl}/entries-tools`, entry,this.createHeaders.createHeaders())
  }

  updateEntry(id:string, entry:Entries): Observable<void>{
    return this.http.patch<void>(`${this.baseUrl}/entries-tools/${id}`, entry, this.createHeaders.createHeaders())
  }

  deleteEntry(entry: Entries): Observable<Entries>{
    return this.http.delete<Entries>(`${this.baseUrl}/entries-tools/${entry.id}`,this.createHeaders.createHeaders());
  }

  searchEntry(term: string): Observable<Entries[]> {
    return this.http.get<Entries[]>(`${this.baseUrl}/entries-tools/search/${term}`,this.createHeaders.createHeaders());
  }

}
