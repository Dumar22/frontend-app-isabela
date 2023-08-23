import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchService } from 'src/app/dashboard/services/search.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { EntriesService } from 'src/app/dashboard/services/entries.service';

@Component({
  selector: 'app-list-transfer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-transfer.component.html',
  styleUrls: ['./list-transfer.component.css']
})
export class ListTransferComponent {


  route: [] = [];

  public invoice: any[] = [];
  //public factura : Invoice;
 // public invoicesTemp: Invoice[] = [];
  public loading: boolean = true;

  constructor(private invoiceService: EntriesService,
    private searchService: SearchService,
    private router: Router) { }

    ngOnInit(): void{

      this.getListInvoices();
  
     };
  
  
     getListInvoices(){
  
      // this.loading = true;
      // this.invoiceService.getInvoices()
      // .subscribe((data:any) =>{
      //   this.invoice = data.invoiceAuth;
      //   //console.log(data);        
      //   this.invoicesTemp = data;
      //   this.loading = false;
      // } );
     }


     //Buscar
 search (term: string ) {

  // if ( term.length === 0 ) {
  //   this.invoice = this.invoicesTemp;
  //   return ;
  // }
  //  this.searchService.search('invoices', term )
  //       .subscribe( resp => {
  //         this.invoice = resp;
  //       });
  }

  downloadInvoice(invoice: any) {
    console.log('dowload',invoice.id);
    
    // this.invoiceService.downloadInvoicePDF(invoice.id)
    // .subscribe(response => {
      
    //   const url = window.URL.createObjectURL(response);
      
    //   const link = document.createElement('a');
    //   link.href = url;
    //   link.download = `factura-${invoice.invoiceNumber}.pdf`;
    //   link.click();

    //   window.URL.revokeObjectURL(url);

   // });
  }


  deleteInvoice(invoice: any) {

    // if ( user.id === this.userService.id ) {
    //   return Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
    // }

    Swal.fire({
    //   title: '¿Borrar entrada?',
    //   text: `Esta a punto de borrar a ${ invoice.invoiceNumber }`,
    //   icon: 'question',
    //   showCancelButton: true,
    //   confirmButtonText: 'Si, borrar'
    // }).then((result) => {
    //   if (result.value) {

    //     this.invoiceService.deleteInvoice( invoice )
    //       .subscribe( resp => {

    //         this.getListInvoices();
    //         Swal.fire(
    //           'Usuario borrado',
    //           `${ invoice.invoiceNumber } fue eliminado correctamente`,
    //           'success'
    //         );

    //       });

    //   }
    })


  }

addInvoice(){
    this.router.navigate(['dashboard/add-invoice']);
  }
  
editInvoice(invoice:any) {
  this.router.navigate(['dashboard/edit-invoice', invoice.id]);
}


}
