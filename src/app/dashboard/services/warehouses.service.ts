import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
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
     return this.http.get<Warehouse>(`${this.baseUrl}/warehouse/${id}`,this.createHeaders())
   }

   saveWarehouse( warehouse: Warehouse): Observable<Warehouse>{
    return this.http.post<Warehouse>(`${this.baseUrl}/warehouse`, warehouse, this.createHeaders())
   }

   updateWarehouse(id:string, warehouse:Warehouse): Observable<void>{
     return this.http.put<void>(`${this.baseUrl}/warehouse/${warehouse.id}`, warehouse, this.createHeaders())
   }

   deleteWarehouse(warehouse: Warehouse): Observable<Warehouse>{
     return this.http.delete<Warehouse>(`${this.baseUrl}/warehouse/${warehouse.id}`, this.createHeaders());
   }

   createHeaders(){
    return {
      headers: new HttpHeaders({
        'Authorization': localStorage.getItem('token')!
      })
    } 
  }

}
