import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchService } from 'src/app/dashboard/services/search.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ExitReg } from 'src/app/dashboard/interfaces/exitRegisterInterface';
import { ExitRegisterService } from 'src/app/dashboard/services/exit-register.service';
import { UiModulesModule } from 'src/app/dashboard/components/ui-modules/ui-modules.module';

@Component({
  selector: 'app-listexit-serie',
  standalone: true,
  imports: [CommonModule, UiModulesModule],
  templateUrl: './listexit-serie.component.html',
  styleUrls: ['./listexit-serie.component.css']
})
export class ListexitSerieComponent {

  route: [] = [];

  public invoice: any[] = [];
  public factura : ExitReg;
  public invoicesTemp: ExitReg[] = [];
  public loading: boolean = true;
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];

  constructor(private exitService: ExitRegisterService,
    private searchService: SearchService,
    private router: Router) { }

    ngOnInit(): void{

      this.getListInvoices();
  
     };
  
  
     getListInvoices(){
  
      this.loading = true;
      this.exitService.getExit()
      .subscribe((data:any) =>{
        this.invoice = data.exitAuth;
        this.invoice.sort((a, b) => a.date.localeCompare(b.date)); 
        this.invoicesTemp = data.exitAuth;
        this.loading = false;
      } );
     }

     onTableDataChange(event: any) {
      this.page = event;
      this.getListInvoices();
    }
    onTableSizeChange(event: any): void {
      this.tableSize = event.target.value;
      this.page = 1;
      this.getListInvoices();
    }

     //Buscar
 search (term: string ) {

  if ( term.length === 0 ) {
    this.invoice = this.invoicesTemp;
    return ;
  }
   this.searchService.search('exitregister', term )
        .subscribe( resp => {
          this.invoice = resp;
        });
  }

  downloadInvoice(exit: ExitReg) {
    console.log('dowload',exit.id);
    
    this.exitService.downloadExitPDF(exit.id)
    .subscribe(response => {
      
      const url = window.URL.createObjectURL(response);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `factura-${exit.exitNumber}.pdf`;
      link.click();

      window.URL.revokeObjectURL(url);

    });
  }


  deleteInvoice(exit: ExitReg) {

    Swal.fire({
      title: '¿Borrar salida?',
      text: `Esta a punto de borrar a ${ exit.exitNumber }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
      if (result.value) {

        this.exitService.deleteExit( exit )
          .subscribe( resp => {

            this.getListInvoices();
            Swal.fire(
              'Salida borrada',
              `${ exit.exitNumber } fue eliminado correctamente`,
              'success'
            );

          });

      }
    })


  }

  detailExit(exit:  ExitReg){      
    this.router.navigate(['dashboard/details-exit-register', exit.id]);
    }

addInvoice(){
    this.router.navigate(['dashboard/add-exit-register']);
  }
  
editInvoice(invoice: ExitReg) {
  this.router.navigate(['dashboard/edit-exit-register', invoice.id]);
}


}
