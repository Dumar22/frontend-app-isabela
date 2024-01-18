import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Invoice } from 'src/app/dashboard/interfaces/invoiceInterface';
import { IvnvoiceServiceService } from '../../../services/ivnvoice-service.service';
import { SearchService } from 'src/app/dashboard/services/search.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Exit } from 'src/app/dashboard/interfaces/exitInterfaces';
import { ExitService } from 'src/app/dashboard/services/exit.service';

@Component({
  selector: 'app-listexit-materials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listexit-materials.component.html',
  styleUrls: ['./listexit-materials.component.css']
})
export class ListexitMaterialsComponent {

  route: [] = [];

  public exit: any[] = [];
  public factura : Exit;
  public exitTemp: Exit[] = [];
  public loading: boolean = true;

  constructor(private exitService: ExitService,
    private searchService: SearchService,
    private router: Router) { }

    ngOnInit(): void{

      this.getListExits();
  
     };
  
  
     getListExits(){
  
      this.loading = true;
      this.exitService.getExit()
      .subscribe((data:any) =>{       
        this.exit = data;              
        this.exitTemp = data;
        this.loading = false;
      } );
     }


    // Buscar
 search (term: string ) {

  if ( term.length === 0 ) {
    this.exit = this.exitTemp;
    return ;
  }
   this.searchService.search('exit', term )
        .subscribe( resp => {
          this.exit = resp;
        });
  }

  downloadExit(exit: Exit) {
    console.log('dowload',exit.id);
    
    this.exitService.downloadExitPDF(exit.id)
    .subscribe(response => {
      
      console.log(response);
      

    });
  }
  
  detailExit(entry: Exit){          
    this.router.navigate(['dashboard/details-exit', entry.id]);
    }

  deleteExit(exit: Exit) {
    Swal.fire({
      title: '¿Borrar entrada?',
      text: `Esta a punto de borrar a ${ exit.ExitNumber }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
      if (result.value) {

        this.exitService.deleteExit( exit )
          .subscribe( resp => {

            this.getListExits();
            Swal.fire(
              'Salida Eliminada',
              `salida ${ exit.ExitNumber } fue eliminada correctamente`,
              'success'
            );

          });

      }
    })


  }

addExit(){
    this.router.navigate(['dashboard/add-exit-material']);
  }
  
editExit(invoice: Invoice) {
  this.router.navigate(['dashboard/edit-exit-material/', invoice.id]);
}


}
