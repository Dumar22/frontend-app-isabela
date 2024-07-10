import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Material } from 'src/app/dashboard/interfaces/materialsInterface';
import { ValidatorsService } from 'src/app/dashboard/services/Validate.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { DetailsExitListComponent } from '../details-exit-list/details-exit-list.component';
import { ListExitMaterialsService } from 'src/app/dashboard/services/listExitMaterials.service';

@Component({
  selector: 'add-exit-list',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,DetailsExitListComponent
  ],
  templateUrl: './add-exit-list.component.html',
  styleUrls: ['./add-exit-list.component.css'],
  
})
export class AddExitListComponent {

  materials:any [] = [];
  detailsArray: FormArray;
  id: string ;
 

  public formExit = this.formBuilder.group({
    nameList: ['', Validators.required],   
    details: this.formBuilder.array([ ]),
  });

 
  constructor(
    private formBuilder: FormBuilder,
    private aRouter: ActivatedRoute,
    private router:Router,
   
    private listMaterialsService:ListExitMaterialsService,
    
     private validatorsService:ValidatorsService) { 
         // Inicializa detailsArray como un FormArray
    this.detailsArray = this.formExit.get('details') as FormArray;
        this.id = this.aRouter.snapshot.paramMap.get('id')?? '';
  }

  
  onMaterialsChange(materials: Material[]) {
    this.materials = materials;
  }
  
  

  isValidField(field: string) {
    return this.validatorsService.isValidField(this.formExit, field);
  }

    
  addExit() {
   const newExit: any = {

nameList: this.formExit.value.nameList,
details: this.materials
   }
   this.listMaterialsService.saveMaterial(newExit)
      .subscribe({
        next: () => {
          this.showNotification(
            '¡Éxito!',
            'Lista de asignación Agregada con éxito:',
            'success'
          );
          this.router.navigate(['dashboard/list-table-exit']);
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
