import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialPeAlPe } from 'src/app/dashboard/interfaces/assignmentPeAlPinterface';
import { Collaborator } from 'src/app/dashboard/interfaces/collaboratorInterface';
import { Material } from 'src/app/dashboard/interfaces/materialsInterface';
import { AssignmentPeAlPeService } from 'src/app/dashboard/services/assignment-pe-al-pe.service';
import { AssignmentMaterialsVehicleService } from 'src/app/dashboard/services/assignmentMaterialsVehicle.service';
import { CollaboratorService } from 'src/app/dashboard/services/collaborator.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { AddEditDetailsAssignmentPeAlPeComponent } from '../add-edit-details-assignment-pe-al-pe/add-edit-details-assignment-pe-al-pe.component';

@Component({
  selector: 'app-add-edit-asiignment-pe-al-pe',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, AddEditDetailsAssignmentPeAlPeComponent
  ],
  templateUrl: './add-edit-asiignment-pe-al-pe.component.html',
  styles: [`
    :host {
      display: block;
    }
  `],
})
export class AddEditAsiignmentPeAlPeComponent { 

  materials:any [] = [];
  collaborator: Collaborator[];
  details: FormArray;


  types = [
    {value: 'Nueva entrga', name: 'Nueva entrega' },
    {value: 'Entrega por perdida', name: 'Entrega por perdida' },
    {value: 'Entrega controlada', name: 'Entrega controlada' },
  ]


  public form = this.formBuilder.group({
    date: ['', Validators.required],
    reason: ['', Validators.required],
    collaboratorId: ['', Validators.required],
    observation: ['', Validators.required],   
    details: this.formBuilder.array([])
      });

  constructor(
    private formBuilder: FormBuilder,
    private aRouter: ActivatedRoute,
    private router:Router,
    private collaboratorService: CollaboratorService,
    private assignmentMaterialsPeAlPeService:AssignmentPeAlPeService,
    ) { 
      this.details = this.form.get('details') as FormArray;
     }


     ngOnInit(): void {
      this.getListCollaborator()
    
    }

  onMaterialsChange(materials: Material[]) {
    this.materials = materials;
  }

  getListCollaborator(){
    this.collaboratorService.getCollaborators()
    .subscribe((data:Collaborator[]) =>{   
        //  console.log(data);
        // filtara tecnicos
      this.collaborator = data
      // this.collaborator = data.filter((collaborator) => {
      //   return collaborator.operation === 'CONDUCTOR' || collaborator.operation === 'CONDUCTOR ' ;
      // });
    });
  }

  add(){

const newAddAssignment: MaterialPeAlPe = {
  date: this.form.value.date,
  reason: this.form.value.reason,
  collaboratorId: this.form.value.collaboratorId,
  observation: this.form.value.observation,
  details: this.materials,
}

this.assignmentMaterialsPeAlPeService.saveMaterialPeAlPe(newAddAssignment)
      .subscribe({
        next: () => {
          this.showNotification(
            '¡Éxito!',
            'Asignación Agregada con éxito:',
            'success'
          );
          this.router.navigate(['dashboard/list-assignment-pe-al-pe']);
        },
        error: (error) => {
          this.handleError(error);
        }
      });
      }


      handleError(error: any) {    
        // console.log(error);
    
        if (error.status === 0) {
            // Error de conexión
            this.showNotification('¡Error!', 'Hubo un error de conexión con el servidor.', 'error');
        } else if (error.status === 500) {
            // Error de conexión     
            this.showNotification('¡Error!', 'Internal Server Error.', 'error');
        } else if (error && error.error && error.error.message) {      
            // Errores de validación del formulario
            const errores = error.error.message;   
    
            if (Array.isArray(errores)) {
                let mensajeError = '';
                errores.forEach((error: { message: any; }, index: number) => {      
                    mensajeError += `${index + 1}. ${error}\n`;
                });
                this.showNotification('¡Error!', mensajeError, 'error');
            } else {         
                // Si el mensaje de error no es un array, podrías manejarlo de otra manera.
                this.showNotification('¡Error!', errores, 'error');
            }
        } else {
            // Manejar otros casos de error aquí
            this.showNotification('¡Error!', 'Error inesperado. Por favor, inténtalo de nuevo.', 'error');
        }
    }
      
      showNotification(title: string, message: string, icon: string) {
        Swal.fire({
          icon: icon as SweetAlertIcon, // Convertimos el parámetro "icon" a un tipo SweetAlertIcon
          title: title,
          text: message,
        });
      }
      
}
