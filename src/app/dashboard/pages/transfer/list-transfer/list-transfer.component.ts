import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Transfers } from 'src/app/dashboard/interfaces/transferInterface';
import { TransferServiceService } from 'src/app/dashboard/services/transfer-service.service';
import { UiModulesModule } from 'src/app/dashboard/components/ui-modules/ui-modules.module';

@Component({
  selector: 'app-list-transfer',
  standalone: true,
  imports: [CommonModule, UiModulesModule],
  templateUrl: './list-transfer.component.html',
  styleUrls: ['./list-transfer.component.css']
})
export class ListTransferComponent {


  route: [] = [];

  public transfer: any[] = [];
  public factura : Transfers;
  public transferTemp: Transfers[] = [];
  public loading: boolean = true;
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];

  constructor(private transferService: TransferServiceService,
    private router: Router) { }

    ngOnInit(): void{

      this.getListTransfers();
  
     };
  
  
     getListTransfers(){
  
      this.loading = true;
      this.transferService.getTransfers()
      .subscribe((data:any) =>{
        this.transfer = data;                
        this.transfer.sort((a, b) => a.date.localeCompare(b.date));
        this.transferTemp = data;
        this.loading = false;
      } );
     }

     onTableDataChange(event: any) {
      this.page = event;
      this.getListTransfers();
    }
    onTableSizeChange(event: any): void {
      this.tableSize = event.target.value;
      this.page = 1;
      this.getListTransfers();
    }

     //Buscar
 search (term: string ) {

  if ( term.length === 0 ) {
    this.transfer = this.transferTemp;
    return ;
  }
   this.transferService.searchTransfer( term )
        .subscribe( resp => {
          this.transfer = resp;
        });
  }

  downloadTransfer(transfer: Transfers)  {
    const id = transfer.id; // replace with your transfer ID
    const transferNumber = transfer.transferNumber
    this.transferService.downloadPDF(id).subscribe((data: ArrayBuffer) => {
      // Crea un Blob a partir del ArrayBuffer recibido
      const blob = new Blob([data], { type: 'application/pdf' });
    
      // Crea una URL para el Blob y utiliza un enlace <a> para iniciar la descarga del archivo
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.download = `Traslado_${transferNumber}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
 
    
     
    });
  }


  deleteTransfer(transfer: Transfers) {


    Swal.fire({
      title: '¿Borrar Traslado?',
      text: `Esta a punto de borrar el traslado ${ transfer.transferNumber }`,
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

  detailTransfer(transfer: Transfers){      
    this.router.navigate(['dashboard/details-transfer', transfer.id]);
    }

addTransfer(){
    this.router.navigate(['dashboard/add-transfer']);
  }
  
editTransfer(transfer:Transfers) {
  this.router.navigate(['dashboard/edit-transfer', transfer.id]);
}


}
