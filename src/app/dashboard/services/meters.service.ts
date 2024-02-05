import { Injectable } from '@angular/core';
import { WarehousesService } from './warehouses.service';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Meter } from '../interfaces/metersInterface';

@Injectable({
  providedIn: 'root'
})
export class MetersService {

  baseUrl=environment.base_url


  constructor(private http: HttpClient, private createHeaders: WarehousesService) { }

   getMeters():Observable<Meter[]> {
   return this.http.get<Meter[]>(`${this.baseUrl}/meters`,this.createHeaders.createHeaders())

   }


  getMeterById(id:string):Observable<Meter>{
    return this.http.get<Meter>(`${this.baseUrl}/meters/${id}`,this.createHeaders.createHeaders())
  }

  saveMeter( meter: Meter): Observable<Meter>{
   return this.http.post<Meter>(`${this.baseUrl}/meters`, meter,this.createHeaders.createHeaders())
  }

  updateMeter(id:string, meter:Meter): Observable<void>{
    return this.http.patch<void>(`${this.baseUrl}/meters/${id}`, meter,this.createHeaders.createHeaders())
  }

  deleteMeter(meter: Meter): Observable<Meter>{
    return this.http.delete<Meter>(`${this.baseUrl}/meters/${meter.id}`,this.createHeaders.createHeaders());
  }

  searchMeter(term: string): Observable<Meter[]> {
    return this.http.get<Meter[]>(`${this.baseUrl}/meters/search/${term}`,this.createHeaders.createHeaders());
  }

  loadMeters(file: File): Observable<number> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const headers = this.createHeaders.createHeaders();
    return this.http.post(`${this.baseUrl}/meters/upload-excel`, formData, {
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
