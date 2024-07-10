import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Invoice } from '../interfaces/invoiceInterface';

@Injectable({
  providedIn: 'root'
})
export class IvnvoiceServiceService {

  baseUrl=environment.base_url


  constructor(private http: HttpClient) { }

   getInvoices():Observable<Invoice[]> {
    
   return  this.http.get<Invoice[]>(`${this.baseUrl}/invoices`, this.createHeaders())

   }


  getInvoiceById(id:string):Observable<Invoice>{
    return this.http.get<Invoice>(`${this.baseUrl}/invoice/${id}`,this.createHeaders())
  }
  downloadInvoicePDF(id: string) {
    return this.http.get(`${this.baseUrl}/dowload-invoice/${id}`, {
      responseType: 'blob' 
    });
  }

  saveInvoice( invoice: Invoice): Observable<Invoice>{
   return this.http.post<Invoice>(`${this.baseUrl}/invoice`, invoice)
  }

  updateInvoice(id:string, invoice:Invoice): Observable<void>{
    return this.http.put<void>(`${this.baseUrl}/invoice/${invoice.id}`, invoice)
  }

  deleteInvoice(invoice: Invoice): Observable<Invoice>{
    return this.http.delete<Invoice>(`${this.baseUrl}/invoice/${invoice.id}`);
  }

  createHeaders(){
    return {
      headers: new HttpHeaders({
        'Authorization': localStorage.getItem('token')!
      })
    } 
  }

}
