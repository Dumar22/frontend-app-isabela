import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { ValidatorsService } from 'src/app/dashboard/services/Validate.service';
import { Contract, Exit } from 'src/app/dashboard/interfaces/exitInterfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { ExitService } from 'src/app/dashboard/services/exit.service';
import { Collaborator } from 'src/app/dashboard/interfaces/collaboratorInterface';
import { CollaboratorService } from 'src/app/dashboard/services/collaborator.service';
import { WorkRegisterService } from 'src/app/dashboard/services/work-install.service';
import { AddDetailsExitComponent } from '../add-details/add-details.component';
import { Material } from 'src/app/dashboard/interfaces/materialsInterface';

@Component({
  selector: 'add-exit-material',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, AddDetailsExitComponent, ],
  templateUrl: './add-edit-materials.component.html',
  styleUrls: ['./add-edit-materials.component.css']
})
export class AddMaterialsComponent {
  materials:any [] = [];
  detailsArray: FormArray;
  id: string ;
  mode: string = 'Agregar '; 
  public collaborator: Collaborator[];
  public contract: Contract[];

  typeAssinment = [
    { name: 'Servicios adicionales'},
    { name: 'Puesta en servicio'},
    { name: 'Instalación'},
    { name: 'Retail'},
  ]
  stateAssinment = [
    { name: 'Pendiente'},
    { name: 'Completado'},
    { name: 'Rechazada'},
  ]

  public formExit = this.formBuilder.group({
    date: ['', Validators.required],
    type: ['', Validators.required],
    state: ['', Validators.required],
    observation: [''],
    collaboratorId: ['', Validators.required],
    contractId: ['', Validators.required],
    details: this.formBuilder.array([ ]),
  });

 
  constructor(
    private formBuilder: FormBuilder,
    private aRouter: ActivatedRoute,
    private router:Router,
    private collaboratorService: CollaboratorService,
    private contractService: WorkRegisterService,
    private exitService:ExitService,
    private validatorsService:ValidatorsService) { 
         // Inicializa detailsArray como un FormArray
    this.detailsArray = this.formExit.get('details') as FormArray;
        this.id = this.aRouter.snapshot.paramMap.get('id')?? '';
  }

  ngOnInit(): void {
    this.getListCollaborator()
    this.getListContract()
    
  }
  onMaterialsChange(materials: Material[]) {
    this.materials = materials;
  }

  getListCollaborator(){
    this.collaboratorService.getCollaborators()
    .subscribe((data:any) =>{      
      this.collaborator = data.filter(collaborator => collaborator.status === true);
      this.collaborator.sort((a, b) => a.name.localeCompare(b.name));  
      
  });
  }
  getListContract(){
    this.contractService.getWorkRegister()
    .subscribe((data:any) =>{      
      this.contract = data;      
  });
  }
  

  isValidField(field: string) {
    return this.validatorsService.isValidField(this.formExit, field);
  }

    
  addExit() {
   const newExit: any = {

date: this.formExit.value.date,
type: this.formExit.value.type,
state: this.formExit.value.state,
observation: this.formExit.value.observation,
collaboratorId: this.formExit.value.collaboratorId,
contractId: this.formExit.value.contractId,
details: this.materials
   }
  //  console.log(newExit)
   this.exitService.saveExit(newExit)
      .subscribe({
        next: () => {
          this.showNotification(
            '¡Éxito!',
            'Asignación Agregada con éxito:',
            'success'
          );
          this.router.navigate(['dashboard/list-exit-materials']);
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