import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddEdetDetailsAssignmentMaterialsVehicleComponent } from '../add-edet-details-assignment-materials-vehicle/add-edet-details-assignment-materials-vehicle.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CollaboratorService } from 'src/app/dashboard/services/collaborator.service';
import { ValidatorsService } from 'src/app/dashboard/services/Validate.service';
import { AssignmentMaterialsVehicleService } from 'src/app/dashboard/services/assignmentMaterialsVehicle.service';
import { Collaborator } from 'src/app/dashboard/interfaces/collaboratorInterface';
import { VehicleService } from 'src/app/dashboard/services/vehicle.service';
import { Vehicle } from 'src/app/dashboard/interfaces/vehiclesInterface';
import { Material } from 'src/app/dashboard/interfaces/materialsInterface';
import { MaterialVehicle } from '../../../interfaces/assignmentMaterialsVehicleInterface';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-add-edit-assignment-materials-vehicle',
  standalone: true,
  imports: [
    CommonModule,ReactiveFormsModule, AddEdetDetailsAssignmentMaterialsVehicleComponent
  ],
  templateUrl: './add-edit-assignment-materials-vehicle.component.html' ,
  styleUrls: ['./add-edit-assignment-materials-vehicle.component.css'],
  
})
export class AddEditAssignmentMaterialsVehicleComponent { 

  materials:any [] = [];
  collaborator: Collaborator[];
  vehicles: Vehicle[];
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
    vehicleId: ['', Validators.required],
    observation: ['', Validators.required],   
    details: this.formBuilder.array([])
      });

  constructor(
    private formBuilder: FormBuilder,
    private aRouter: ActivatedRoute,
    private router:Router,
    private collaboratorService: CollaboratorService,
    private vehicleService: VehicleService,
    private assignmentMaterialsVehicleService:AssignmentMaterialsVehicleService,
     private validatorsService:ValidatorsService) { 
      this.details = this.form.get('details') as FormArray;
     }


     ngOnInit(): void {
      this.getListCollaborator()
      this. getListVehicles()
    }

  onMaterialsChange(materials: Material[]) {
    this.materials = materials;
  }

  getListCollaborator(){
    this.collaboratorService.getCollaborators()
    .subscribe((data:Collaborator[]) =>{   
        //  console.log(data);
         
      this.collaborator = data.filter((collaborator) => {
        return collaborator.operation === 'CONDUCTOR' || collaborator.operation === 'CONDUCTOR ' ;
      });
    });
  }
  
  getListVehicles(){
    this.vehicleService.getVehicles()
    .subscribe((data:Vehicle[]) =>{            
      this.vehicles = data;
      
  });
  }

  add(){

const newAddAssignment: MaterialVehicle = {
  date: this.form.value.date,
  reason: this.form.value.reason,
  collaboratorId: this.form.value.collaboratorId,
  vehicleId: this.form.value.vehicleId,
  observation: this.form.value.observation,
  details: this.materials,
}

this.assignmentMaterialsVehicleService.saveToolAssignment(newAddAssignment)
      .subscribe({
        next: () => {
          this.showNotification(
            '¡Éxito!',
            'Asignación Agregada con éxito:',
            'success'
          );
          this.router.navigate(['dashboard/list-assignment-materials-vehicles']);
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

  



