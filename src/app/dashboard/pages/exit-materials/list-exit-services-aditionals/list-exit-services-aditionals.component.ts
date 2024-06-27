import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { UiModulesModule } from 'src/app/dashboard/components/ui-modules/ui-modules.module';
import { Exit } from 'src/app/dashboard/interfaces/exitInterfaces';
import { ExitServiceAditionalsService } from 'src/app/dashboard/services/exit-service-aditionals.service';
import { ExitService } from 'src/app/dashboard/services/exit.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-list-exit-services-aditionals',
  standalone: true,
  imports: [
    CommonModule,UiModulesModule
  ],
  templateUrl: './list-exit-services-aditionals.component.html',
  styleUrls: ['./list-exit-services-aditionals.component.css'],
 
})
export class ListExitServicesAditionalsComponent {

  route: [] = [];

  public exit: Exit[] = [];
  public factura : Exit;
  public exitTemp: Exit[] = [];
  public loading: boolean = true;

  limit = 20; // Establecer el límite de unidades para marcar en amarillo
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  tableSizes: any = [3, 6, 9, 12];
 

  constructor(private exitService: ExitServiceAditionalsService,
    
    private router: Router) { }

    ngOnInit(): void{

      this.getListExits();
  
     };
  
  
     getListExits(){
  
      this.loading = true;
      this.exitService.getExit()
      .subscribe((data:Exit[]) =>{     
        this.exit = data;   
        this.exit.sort((a, b) => b.ExitNumber - a.ExitNumber);          
        this.exitTemp = data;
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
  

    onTableDataChange(event: any) {
      this.page = event;
      this.getListExits();
    }
    
    onTableSizeChange(event: any): void {
      this.tableSize = event.target.value;
      this.page = 1;
      this.getListExits();
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
    this.router.navigate(['dashboard/details-exit-serv-aditionals', entry.id]);
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
    this.router.navigate(['dashboard/exit-serv-aditionals']);
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
