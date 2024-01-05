import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Warehouse } from '../interfaces/warehouseInterface';

@Injectable({
  providedIn: 'root'
})
export class WarehousesService {


  baseUrl=environment.base_url



  constructor( private http: HttpClient) { }


  getWarehouses():Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(`${this.baseUrl}/warehouses`,this.createHeaders())

    }


   getWarehouseById(id:string):Observable<Warehouse>{
     return this.http.get<Warehouse>(`${this.baseUrl}/warehouses/${id}`,this.createHeaders())
   }

   saveWarehouse( warehouse: Warehouse): Observable<Warehouse>{
    return this.http.post<Warehouse>(`${this.baseUrl}/warehouses`, warehouse, this.createHeaders())
   }

   updateWarehouse(id:string, warehouse:Warehouse): Observable<void>{
     return this.http.patch<void>(`${this.baseUrl}/warehouses/${id}`, warehouse, this.createHeaders())
   }

   deleteWarehouse(warehouse: Warehouse): Observable<Warehouse>{
     return this.http.delete<Warehouse>(`${this.baseUrl}/warehouses/${warehouse.id}`, this.createHeaders());
   }

   createHeaders(){
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${ token }`)
      }
    } 
  }


