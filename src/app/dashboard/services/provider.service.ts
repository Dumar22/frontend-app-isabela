import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
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


   getProviderById(id:string):Observable<Provider>{
     return this.http.get<Provider>(`${this.baseUrl}/provider/${id}`, this.createHeaders.createHeaders())
   }

   saveProvider( provider: Provider): Observable<Provider>{
    return this.http.post<Provider>(`${this.baseUrl}/provider`, provider,  this.createHeaders.createHeaders())
   }

   updateProvider(id:string, provider:Provider): Observable<void>{
     return this.http.put<void>(`${this.baseUrl}/provider/${provider.id}`, provider,  this.createHeaders.createHeaders())
   }

   deleteProvider(provider: Provider): Observable<Provider>{
     return this.http.delete<Provider>(`${this.baseUrl}/provider/${provider.id}`,  this.createHeaders.createHeaders());
   }


   
}
