import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Exit } from 'src/app/dashboard/interfaces/exitInterfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { ExitService } from 'src/app/dashboard/services/exit.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details-exit.component.html',
  styleUrls: ['./details-exit.component.css']
})
export class DetailsExitComponent {
  exit: Exit;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private exitService: ExitService
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
        this.router.navigate(['dashboard/edit-exit-material', exit.id]);
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
    this.router.navigate(['dashboard/list-exit-materials']);
  }


  showNotification(title: string, message: string, icon: string) {
    Swal.fire({
      icon: icon as SweetAlertIcon, // Convertimos el parámetro "icon" a un tipo SweetAlertIcon
      title: title,
      text: message,
    });
  }

}
