import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, Validators, FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UiModulesModule } from 'src/app/dashboard/components/ui-modules/ui-modules.module';
import { Collaborator } from 'src/app/dashboard/interfaces/collaboratorInterface';
import { Contract, Exit } from 'src/app/dashboard/interfaces/exitInterfaces';
import { CollaboratorService } from 'src/app/dashboard/services/collaborator.service';
import { ExitService } from 'src/app/dashboard/services/exit.service';
import { WorkRegisterService } from 'src/app/dashboard/services/work-install.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Material } from 'src/app/dashboard/interfaces/materialsInterface';
import { DetailsEditExitComponent } from '../details-edit-exit/details-edit-exit.component';


@Component({
  selector: 'app-edit-exit',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, UiModulesModule, DetailsEditExitComponent
  ],
  templateUrl: './edit-exit.component.html',
  styleUrls: ['./edit-exit.component.css'],
})
export class EditExitComponent { 

  materials:any [] = [];
  detailsArray: FormArray;
  newMaterials: any[] = [];
  id: string ;
  mode: string = 'Agregar '; 
  public collaborator: Collaborator[];
  public contract: Contract[];

  typeAssinment = [
    { name: 'Servicios adicionales'},
    { name: 'Puesta en servicio'},
    { name: 'Instalación'},
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
    details: this.formBuilder.array([]),
  });

 
  constructor(
    private formBuilder: FormBuilder,
    private aRouter: ActivatedRoute,
    private router:Router,
    private collaboratorService: CollaboratorService,
    private contractService: WorkRegisterService,
    private exitService:ExitService,) { 
         // Inicializa detailsArray como un FormArray
    this.detailsArray = this.formExit.get('details') as FormArray;
        this.id = this.aRouter.snapshot.paramMap.get('id')?? '';
  }

  ngOnInit(): void {
    this.getListCollaborator()
    this.getListContract()
    if (this.id != '') {
  
      this.getExit(this.id);
    }    
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

  loadMaterialsDetails(exit: any) {
    this.materials = exit.details; // Asegúrate de que exit.details tenga los datos necesarios
    this.materials.forEach((detail: any, index: number) => {
      this.addMaterialDetail(detail, index);
    });
  }
  
  getExit(id: string){
    if (id) {
      // Carga los datos de la salida existente
      this.exitService.getExitById(this.id).subscribe((exit: any) => {
        // Llena el formulario con los datos existentes

        // const formattedDate = moment(exit.date).format('YYYY-MM-DD');
        const formattedDate = new Date(exit.date).toISOString().slice(0, 16); // Formatear la fecha y hora

        this.formExit.patchValue({
          date: formattedDate,
          type: exit.type,
          state: exit.state,
          observation: exit.observation,
          collaboratorId: exit.collaborator.id,
          contractId: exit.contract.id,
          
        });
        this.loadMaterialsDetails(exit);
      });
  }}

  addMaterialDetail(detail: any, index: number) {
    const materialDetail = this.formBuilder.group({
      materialId: [detail.materialId],
      assignedQuantity: [detail.assignedQuantity],
      restore: [detail.restore],
      
    });
  
    // Escucha los cambios en el control 'restore'
    materialDetail.get('restore').valueChanges.subscribe((newValue) => {
      // Actualiza el valor en el modelo
      this.materials[index].restore = newValue;
    });
    materialDetail.get('assignedQuantity').valueChanges.subscribe((newValue) => {
      // Actualiza el valor en el modelo
      this.materials[index].assignedQuantity = newValue;
    });
   
    this.detailsArray.push(materialDetail);
  }


    
  addExit() {

    
   const newExit:Exit = {
     date: this.formExit.value.date,
     type: this.formExit.value.type,
     state: this.formExit.value.state,
     observation: this.formExit.value.observation,
     collaboratorId: this.formExit.value.collaboratorId,
     contractId: this.formExit.value.contractId,
     details: this.materials,
     newDetails:this.newMaterials

   }
   
   this.exitService.updateExit(this.id, newExit)
      .subscribe({
        next: () => {
          this.showNotification(
            '¡Éxito!',
            'Salida editada con éxito:',
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
       console.log(error);
    
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
