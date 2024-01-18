import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { UiModulesModule } from 'src/app/dashboard/components/ui-modules/ui-modules.module';
import { Proyect } from 'src/app/dashboard/interfaces/proyectsInterface';
import { ProyectsService } from 'src/app/dashboard/services/proyects.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-edit-proyect',
  standalone: true,
  imports: [
    CommonModule, UiModulesModule
  ],
  template: `
 
  
  `,
  styleUrls: ['./addEditProyect.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEditProyectComponent {
  
  

}

