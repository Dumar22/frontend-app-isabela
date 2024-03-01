import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Invoice } from 'src/app/dashboard/interfaces/invoiceInterface';
import { Router } from '@angular/router';
import Swal, { SweetAlertIcon } from 'sweetalert2';
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
    
    private router: Router) { }

    ngOnInit(): void{

      this.getListExits();
  
     };
  
  
     getListExits(){
  
      this.loading = true;
      this.exitService.getExit()
      .subscribe((data:Exit[]) =>{     
        this.exit = data; 
        this.exit.sort((a, b) => b.ExitNumber.toString().localeCompare(a.ExitNumber.toString()));             
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
   this.exitService.searchExit( term )
        .subscribe( resp => {
          this.exit = resp;
          console.log(resp);
          
          this.exit.sort((a, b) => b.ExitNumber.toString().localeCompare(a.ExitNumber.toString()));
        });
  }

  downloadExit(exit: Exit) {
    const id = exit.id; // replace with your transfer ID
    console.log(id);
    
    const exitnumber = exit.ExitNumber
    this.exitService.downloadPDF(id).subscribe((data: ArrayBuffer) => {
      // Crea un Blob a partir del ArrayBuffer recibido
      const blob = new Blob([data], { type: 'application/pdf' });
    
      // Crea una URL para el Blob y utiliza un enlace <a> para iniciar la descarga del archivo
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.download = `Salida_${exitnumber}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);

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
addExitList(){
    this.router.navigate(['dashboard/add-list']);
  }
  
editExit(invoice: Invoice) {

  const typeExit = this.exitService.getExitById(invoice.id)
  .subscribe((data:Exit) =>{     
    const typeExit = data.state;   
    
    if(typeExit != 'Completado'){
      this.router.navigate(['dashboard/edit-exit-material', invoice.id]);
    }else{
      this.showNotification(
        '¡Error!',
        'Para ésta salida el estado es completada, contacte al administrador',
        'error'
      );

    }
    
  } );


  
 // this.router.navigate(['dashboard/edit-exit-material/', invoice.id]);
}


showNotification(title: string, message: string, icon: string) {
  Swal.fire({
    icon: icon as SweetAlertIcon, // Convertimos el parámetro "icon" a un tipo SweetAlertIcon
    title: title,
    text: message,
  });
}

}
