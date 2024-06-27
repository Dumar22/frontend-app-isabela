import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddDetailsExitComponent } from '../add-details/add-details.component';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Collaborator } from 'src/app/dashboard/interfaces/collaboratorInterface';
import { Contract } from 'src/app/dashboard/interfaces/exitInterfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { CollaboratorService } from 'src/app/dashboard/services/collaborator.service';
import { WorkRegisterService } from 'src/app/dashboard/services/work-install.service';
import { ExitService } from 'src/app/dashboard/services/exit.service';
import { ValidatorsService } from 'src/app/dashboard/services/Validate.service';
import { Material } from 'src/app/dashboard/interfaces/materialsInterface';
import { ExitServiceAditionalsService } from 'src/app/dashboard/services/exit-service-aditionals.service';

@Component({
  selector: 'app-exit-materials-service-aditionals',
  standalone: true,
  imports: [
    CommonModule,ReactiveFormsModule, AddDetailsExitComponent,
  ],
  templateUrl: './exit-materials-service-aditionals.component.html',
  styleUrls: ['./exit-materials-service-aditionals.component.css'],
  
})
export class ExitMaterialsServiceAditionalsComponent { 

  materials:any [] = [];
  detailsArray: FormArray;
  type: string;
  id: string ;
  mode: string = 'Agregar '; 
  public collaborator: Collaborator[];
  public contract: Contract[];
  public contractPost: Contract[];

  typeAssinment = [
    //{ name: 'Servicios adicionales'},
    
    { name: 'Servicios adicionales'},
    { name: 'Retail'},
  ]
  stateAssinment = [
    { name: 'Pendiente'},
    { name: 'Completado'},
    { name: 'Rechazada'},
    { name: 'Retail'},
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
    private exitService:ExitServiceAditionalsService,
    private validatorsService:ValidatorsService) { 
         // Inicializa detailsArray como un FormArray
    this.detailsArray = this.formExit.get('details') as FormArray;
        this.id = this.aRouter.snapshot.paramMap.get('id')?? '';
  }

  ngOnInit(): void {
    this.getListCollaborator()
   
    this.getListContractPostSerice()
    
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
  
  getListContractPostSerice(){
    this.contractService.getWorkRegisterPostService()
    .subscribe((data:any) =>{      
      this.contractPost = data; 
      this.contractPost.sort((a, b) => b.contractNumber - a.contractNumber);      
  });
  }
  onTypeChange(event: any) {
    this.type = event.target.value;
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
          this.router.navigate(['dashboard/list-exit-serv-aditionals']);
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
