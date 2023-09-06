import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WarehousesService } from './warehouses.service';
import { Transfers } from '../interfaces/transferInterface';

@Injectable({
  providedIn: 'root'
})
export class TransferServiceService {

  baseUrl=environment.base_url


  constructor(private http: HttpClient, private createHeaders: WarehousesService) { }

   getTransfers():Observable<Transfers[]> {
    
   return  this.http.get<Transfers[]>(`${this.baseUrl}/transfer`, this.createHeaders.createHeaders())

   }


  getTransfersById(id:string):Observable<Transfers>{
    return this.http.get<Transfers>(`${this.baseUrl}/transfer/${id}`,this.createHeaders.createHeaders())
  }
  // downloadTransfersPDF(id: string) {
  //   return this.http.get(`${this.baseUrl}/dowload-transfer/${id}`, {
  //     responseType: 'blob' 
  //   });
  // }

  saveTransfers( transfer: Transfers): Observable<Transfers>{
   return this.http.post<Transfers>(`${this.baseUrl}/transfer`, transfer,this.createHeaders.createHeaders())
  }

  updateTransfers(id:string, transfer:Transfers): Observable<void>{
    return this.http.put<void>(`${this.baseUrl}/transfer/${transfer.id}`, transfer, this.createHeaders.createHeaders())
  }

  deleteTransfers(transfer: Transfers): Observable<Transfers>{
    return this.http.delete<Transfers>(`${this.baseUrl}/transfer/${transfer.id}`,this.createHeaders.createHeaders());
  }

  downloadTransfersPDF(id: string) {

    const headers = this.createHeaders.createHeaders();
    return this.http.get(`${this.baseUrl}/dowload-transfer/${id}`, {
      headers: headers.headers,
       responseType: 'blob' 
    });
  }
}
