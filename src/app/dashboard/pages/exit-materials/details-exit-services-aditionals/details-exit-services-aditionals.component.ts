import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Exit } from 'src/app/dashboard/interfaces/exitInterfaces';
import { ExitServiceAditionalsService } from 'src/app/dashboard/services/exit-service-aditionals.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-details-exit-services-aditionals',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './details-exit-services-aditionals.component.html',
  styleUrls: ['./details-exit-services-aditionals.component.css'],
  
})
export class DetailsExitServicesAditionalsComponent { 

  exit: Exit;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private exitService: ExitServiceAditionalsService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.exitService.getExitById(id).subscribe((data: any) => {
      this.exit = data;
             
         
    });
  }

  editExit(exit: Exit) {
    

    const typeExit = this.exitService.getExitById(exit.id)
    .subscribe((data:Exit) =>{     
      const typeExit = data.state;   
      
      if(typeExit != 'Completado'){
        this.router.navigate(['dashboard/edit-exit-serv-aditionals', exit.id]);
      }else{
        this.showNotification(
          '¡Error!',
          'Para ésta salida el estado es completada, contacte al administrador',
          'error'
        );
  
      }
      
    } );
  }

  prev() {
    this.router.navigate(['dashboard/list-exit-serv-aditionals']);
  }


  showNotification(title: string, message: string, icon: string) {
    Swal.fire({
      icon: icon as SweetAlertIcon, // Convertimos el parámetro "icon" a un tipo SweetAlertIcon
      title: title,
      text: message,
    });
  }
}
