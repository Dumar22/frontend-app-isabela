import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchService } from 'src/app/dashboard/services/search.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Transfers } from 'src/app/dashboard/interfaces/transferInterface';
import { TransferServiceService } from 'src/app/dashboard/services/transfer-service.service';

@Component({
  selector: 'app-list-transfer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-transfer.component.html',
  styleUrls: ['./list-transfer.component.css']
})
export class ListTransferComponent {


  route: [] = [];

  public transfer: any[] = [];
  public factura : Transfers;
  public transferTemp: Transfers[] = [];
  public loading: boolean = true;

  constructor(private transferService: TransferServiceService,
    private searchService: SearchService,
    private router: Router) { }

    ngOnInit(): void{

      this.getListTransfers();
  
     };
  
  
     getListTransfers(){
  
      this.loading = true;
      this.transferService.getTransfers()
      .subscribe((data:any) =>{
        this.transfer = data.transferAuth;
        //console.log(data);        
        this.transferTemp = data;
        this.loading = false;
      } );
     }


     //Buscar
 search (term: string ) {

  if ( term.length === 0 ) {
    this.transfer = this.transferTemp;
    return ;
  }
   this.searchService.search('invoices', term )
        .subscribe( resp => {
          this.transfer = resp;
        });
  }

  downloadTransfer(transfer: Transfers) {
    console.log('dowload',transfer.id);
    
    this.transferService.downloadTransfersPDF(transfer.id)
    .subscribe(response => {
      
      const url = window.URL.createObjectURL(response);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `factura-${transfer.transferNumber}.pdf`;
      link.click();

      window.URL.revokeObjectURL(url);

   });
  }


  deleteTransfer(transfer: Transfers) {


    Swal.fire({
      title: '¿Borrar traslado?',
      text: `Esta a punto de borrar a ${ transfer.transferNumber }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
      if (result.value) {

        this.transferService.deleteTransfers( transfer )
          .subscribe( resp => {

            this.getListTransfers();
            Swal.fire(
              'Translado Eliminado',
              `${ transfer.transferNumber } fue eliminado correctamente`,
              'success'
            );

          });

      }
    })


  }

addTransfer(){
    this.router.navigate(['dashboard/add-transfer']);
  }
  
editTransfer(transfer:Transfers) {
  this.router.navigate(['dashboard/edit-transfer', transfer.id]);
}


}
