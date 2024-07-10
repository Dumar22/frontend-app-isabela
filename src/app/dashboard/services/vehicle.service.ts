import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WarehousesService } from './warehouses.service';
import { Vehicle } from '../interfaces/vehiclesInterface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  baseUrl=environment.base_url



  constructor( private http: HttpClient,
    private createHeaders: WarehousesService) { }


  getVehicles():Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.baseUrl}/vehicles`, this.createHeaders.createHeaders())

    }
  getVehiclesL(currentPage: number, itemsPerPage: number):Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.baseUrl}/vehicles`, this.createHeaders.createHeaders())

    }


   getVehicleById(id:string):Observable<Vehicle>{
     return this.http.get<Vehicle>(`${this.baseUrl}/vehicles/${id}`, this.createHeaders.createHeaders())
   }

   saveVehicle( vehicle: Vehicle): Observable<Vehicle>{
    return this.http.post<Vehicle>(`${this.baseUrl}/vehicles`, vehicle,  this.createHeaders.createHeaders())
   }

   updateVehicle(id:string, vehicle:Vehicle): Observable<void>{
     return this.http.patch<void>(`${this.baseUrl}/vehicles/${id}`, vehicle,  this.createHeaders.createHeaders())
   }

   deleteVehicle(vehicle: Vehicle): Observable<Vehicle>{
     return this.http.delete<Vehicle>(`${this.baseUrl}/vehicles/${vehicle.id}`,  this.createHeaders.createHeaders());
   }


   
}
