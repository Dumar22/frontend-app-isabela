import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { WarehousesService } from './warehouses.service';
import { Transfers } from '../interfaces/transferInterface';

@Injectable({
  providedIn: 'root'
})
export class TransferServiceService {

  baseUrl=environment.base_url


  constructor(private http: HttpClient, private createHeaders: WarehousesService) { }

   getTransfers():Observable<Transfers[]> {
    
   return  this.http.get<Transfers[]>(`${this.baseUrl}/transfers`, this.createHeaders.createHeaders())

   }

  getTransfersById(id:string):Observable<Transfers>{
    return this.http.get<Transfers>(`${this.baseUrl}/transfers/${id}`,this.createHeaders.createHeaders())
  }
 
  saveTransfers( transfer: Transfers): Observable<Transfers>{
   return this.http.post<Transfers>(`${this.baseUrl}/transfers`, transfer,this.createHeaders.createHeaders())
  }

  updateTransfers(id:string, transfer:Transfers): Observable<Transfers>{
    return this.http.patch<Transfers>(`${this.baseUrl}/transfers/${id}`, transfer, this.createHeaders.createHeaders())
  }

  deleteTransfers(transfer: Transfers): Observable<Transfers>{
    return this.http.delete<Transfers>(`${this.baseUrl}/transfers/${transfer.id}`,this.createHeaders.createHeaders());
  }

  searchTransfer(term: string): Observable<Transfers[]> {
    return this.http.get<Transfers[]>(`${this.baseUrl}/transfer/search/${term}`,this.createHeaders.createHeaders());
  }

  downloadPDF(id: string): Observable<ArrayBuffer> {
    const url = `${this.baseUrl}/transfers/pdf/${id}`;
    const headers = this.createHeaders.createHeaders();  // Asegúrate de incluir las cabeceras necesarias
  
    return this.http.get(url, { headers:headers.headers, responseType: 'arraybuffer' });
  }
}
