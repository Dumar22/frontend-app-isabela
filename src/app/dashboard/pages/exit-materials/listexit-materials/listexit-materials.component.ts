import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Invoice } from 'src/app/dashboard/interfaces/invoiceInterface';
import { Router } from '@angular/router';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Exit } from 'src/app/dashboard/interfaces/exitInterfaces';
import { ExitService } from 'src/app/dashboard/services/exit.service';
import { UiModulesModule } from 'src/app/dashboard/components/ui-modules/ui-modules.module';

@Component({
  selector: 'app-listexit-materials',
  standalone: true,
  imports: [CommonModule, UiModulesModule],
  templateUrl: './listexit-materials.component.html',
  styleUrls: ['./listexit-materials.component.css']
})
export class ListexitMaterialsComponent {

  route: [] = [];

  public exit: Exit[] = [];
  public factura : Exit;
  public exitTemp: Exit[] = [];
  public loading: boolean = true;

   // Establecer el límite de unidades para marcar en amarillo
  page: number = 1;
  count: number = 0;
  totalItems: number = 0;
  tableSize: number = 10;
  tableSizes: any = [3, 6, 9, 12];
  limit: number = 10;
  offset: number = 0;
 

  constructor(private exitService: ExitService,
    
    private router: Router) { }

    ngOnInit(): void{

      this.getListExits();
  
     };
  
  
     getListExits(){
  
      this.loading = true;
      this.exitService.getExit(this.limit, this.offset)
      .subscribe(response =>{  
                   
        this.exit = response.data;         
         //this.exit.sort((a, b) => b.ExitNumber - a.ExitNumber);          
         this.exitTemp = response.data;
         this.totalItems = response.totalItems;
         this.exit.forEach(salida => {
           salida.details.forEach(detail => {
             if (detail.meter) {
               
             }
           });
         });
        this.loading = false;
      } );
     }

     tieneMedidor(details: any[]): boolean {
      return details.some(detalle => !!detalle.meter);
    }
  
    obtenerSerialMedidor(details: any[]): string {
      const detalleConMedidor = details.find(detalle => !!detalle.meter);
      return detalleConMedidor ? detalleConMedidor.meter.serial : '';
    }
  

    setPage(pageIndex: number): void {
      this.offset = pageIndex * this.limit;
      this.getListExits();
    }
  
    previousPage(): void {
      if (this.offset > 0) {
        this.offset -= this.limit;
        this.getListExits();
      }
    }
  
    nextPage(): void {
      if (this.offset + this.limit < this.totalItems) {
        this.offset += this.limit;
        this.getListExits();
      }
    }
  
    totalPagesArray(): number[] {
      const totalPages = Math.ceil(this.totalItems / this.limit);
      const currentPage = this.offset / this.limit;
      let pages = [];
  
      if (totalPages <= 10) {
        pages = Array.from({ length: totalPages }, (_, i) => i);
      } else {
        pages = [0, 1, 2, 3, 4]; // First 5 pages
        if (currentPage > 4 && currentPage < totalPages - 5) {
          pages.push(currentPage - 1, currentPage, currentPage + 1);
        }
        pages.push(totalPages - 3, totalPages - 2, totalPages - 1); // Last 3 pages
        pages = Array.from(new Set(pages)).sort((a, b) => a - b);
      }
      return pages;
    }     

    // Buscar
    search(term: string) {
      if (term.length === 0) {
        this.exit = this.exitTemp;
        return;
      }
    
      this.exitService.searchExit(term).subscribe((resp: any[]) => {
        // Recorrer los resultados de la búsqueda y preservar el serial del medidor
        resp.forEach(salida => {
          salida.details.forEach(detail => {
            if (detail.meter) {
              // Obtener el serial del medidor original
              const originalSerial = this.obtenerSerialMedidor(this.exit.find(e => e.id === salida.id).details);
              // Si el serial del medidor original existe, asignarlo al resultado de la búsqueda
              if (originalSerial) {
                detail.meter.serial = originalSerial;
              }
            }
          });
        });
    
        this.exit = resp;
      });
    }

  downloadExit(exit: Exit) {
    const id = exit.id; // replace with your transfer ID
    
    
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
  
editExit(invoice: Exit) {

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
