import { Observable, map} from 'rxjs';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Provider } from '../interfaces/providerInterface';
import { WarehousesService } from './warehouses.service';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  baseUrl=environment.base_url



  constructor( private http: HttpClient,
    private createHeaders: WarehousesService) { }


  getProviders():Observable<Provider[]> {
    return this.http.get<Provider[]>(`${this.baseUrl}/providers`, this.createHeaders.createHeaders())

    }
  getProvidersL(currentPage: number, itemsPerPage: number):Observable<Provider[]> {
    return this.http.get<Provider[]>(`${this.baseUrl}/providers`, this.createHeaders.createHeaders())

    }


   getProviderById(id:string):Observable<Provider>{
     return this.http.get<Provider>(`${this.baseUrl}/providers/${id}`, this.createHeaders.createHeaders())
   }

   saveProvider( provider: Provider): Observable<Provider>{
    return this.http.post<Provider>(`${this.baseUrl}/providers`, provider,  this.createHeaders.createHeaders())
   }

   updateProvider(id:string, provider:Provider): Observable<void>{
     return this.http.patch<void>(`${this.baseUrl}/providers/${id}`, provider,  this.createHeaders.createHeaders())
   }

   deleteProvider(provider: Provider): Observable<Provider>{
     return this.http.delete<Provider>(`${this.baseUrl}/providers/${provider.id}`,  this.createHeaders.createHeaders());
   }

   searchProvider(term: string): Observable<Provider[]> {
    return this.http.get<Provider[]>(`${this.baseUrl}/providers/search/${term}`,this.createHeaders.createHeaders());
  }

   loadingProviders(file: File): Observable<number> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const headers = this.createHeaders.createHeaders();
    return this.http.post(`${this.baseUrl}/providers/upload-excel`, formData, {
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
