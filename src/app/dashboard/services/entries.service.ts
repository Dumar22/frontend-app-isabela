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
  
  downloadPDF(id: string): Observable<ArrayBuffer> {
    const url = `${this.baseUrl}/entries/pdf/${id}`;
    const headers = this.createHeaders.createHeaders();  // Asegúrate de incluir las cabeceras necesarias
  
    return this.http.get(url, { headers:headers.headers, responseType: 'arraybuffer' });
  }

  saveEntry( entry: Entries): Observable<Entries>{
   return this.http.post<Entries>(`${this.baseUrl}/entries`, entry,this.createHeaders.createHeaders())
  }

  saveEntryFile(entry: Entries, file: File): Observable<Entries> {
    const formData = new FormData();
    const url = `${this.baseUrl}/entries/upload-excel`;
    const headers = this.createHeaders.createHeaders();
    formData.append('date', entry.date); // Ajusta esto según los campos de tu interfaz Entries
    formData.append('entryNumber', entry.entryNumber);
    formData.append('origin', entry.origin);
    formData.append('providerName', entry.providerName);
    formData.append('providerNit', entry.providerNit);
    formData.append('file', file); // Agrega el archivo al formData

    return this.http.post<Entries>(url, formData,{headers:headers.headers} )
      // Asegúrate de configurar correctamente cualquier otra opción que necesites para la solicitud
    };
 

  updateEntry(id:string, entry:Entries): Observable<void>{
    return this.http.patch<void>(`${this.baseUrl}/entries/${id}`, entry, this.createHeaders.createHeaders())
  }

  deleteEntry(entry: Entries): Observable<Entries>{
    return this.http.delete<Entries>(`${this.baseUrl}/entries/${entry.id}`,this.createHeaders.createHeaders());
  }

  searchEntry(term: string): Observable<Entries[]> {
    return this.http.get<Entries[]>(`${this.baseUrl}/entries/search/${term}`,this.createHeaders.createHeaders());
  }

  
}
