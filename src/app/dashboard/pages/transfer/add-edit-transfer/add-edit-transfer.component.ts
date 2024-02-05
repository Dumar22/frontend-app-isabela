import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorsService } from 'src/app/dashboard/services/Validate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TransferServiceService } from 'src/app/dashboard/services/transfer-service.service';
import { CollaboratorService } from 'src/app/dashboard/services/collaborator.service';
import { Collaborator } from 'src/app/dashboard/interfaces/collaboratorInterface';
import { Material, Transfers } from 'src/app/dashboard/interfaces/transferInterface';
import { MaterialDetailsComponent } from '../../material-details/material-details.component';
import { WarehousesService } from 'src/app/dashboard/services/warehouses.service';
import { Warehouse } from 'src/app/dashboard/interfaces/warehouseInterface';

@Component({
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, MaterialDetailsComponent],
  templateUrl: './add-edit-transfer.component.html',
  styleUrls: ['./add-edit-transfer.component.css']
})
export class AddEditTransferComponent {

  materials:Material [] = [];
  id: string ;
  createDetailTransferDto: FormArray;
  mode: string = 'Agregar '; 
  public collaborator: Collaborator[];
  public warehouses: Warehouse[];
  public autorice = [
    {name: 'Juan Felipe Hoyos'},
    {name: 'Sebastian Torres'},
    {name: 'Jose Ramirez'},
  ]

   public formTransfer = this.formBuilder.group({
    date: ['', Validators.required],
    transferNumber: ['', Validators.required],
    origin: ['', Validators.required],
    destination: ['', Validators.required],
    autorization: ['', Validators.required],
    delivery: ['', Validators.required],
    documentdelivery: ['', Validators.required],
    receive: ['', Validators.required],
    documentreceive: ['', Validators.required],
    observation: [''],
    createDetailTransferDto: this.formBuilder.array([])
      });

    
  constructor(
    private formBuilder: FormBuilder,
    private aRouter: ActivatedRoute,
    private router:Router,
    private collaboratorService: CollaboratorService,
    private warehouseService: WarehousesService,
    private transferService:TransferServiceService,
     private validatorsService:ValidatorsService) { 
      this.createDetailTransferDto = this.formTransfer.get('createDetailTransferDto') as FormArray;
        this.id = this.aRouter.snapshot.paramMap.get('id')?? '';
  }

  ngOnInit(): void {
    this.getListCollaborator()
    this.getListWarehouses()
    if (this.id != '') {
      // Es editar
     this.mode = 'Editar ';
      this.getTransfer();
    }
  }

  getListCollaborator(){
    this.collaboratorService.getCollaborators()
    .subscribe((data:any) =>{      
      this.collaborator = data;
      
  });
  }
  getListWarehouses(){
    this.warehouseService.getWarehouses()
    .subscribe((data:any) =>{      
      this.warehouses = data;
      
  });
  }

  isValidField(field: string) {
    return this.validatorsService.isValidField(this.formTransfer, field);
  }

  onMaterialsChange(materials: Material[]) {
    this.materials = materials;
  }

  onCollaboratorSelect() {
    const selectedCollaborator = this.collaborator.find(collaborator => collaborator.name === this.formTransfer.value.delivery);
    if (selectedCollaborator) {
      this.formTransfer.patchValue({
        documentdelivery: selectedCollaborator.document.toString(),       
      });
    }
    const selectedCollaborator2 = this.collaborator.find(collaborator => collaborator.name === this.formTransfer.value.receive);
    if (selectedCollaborator2) {
      this.formTransfer.patchValue({        
        documentreceive: selectedCollaborator2.document.toString(),
        
      });
    } } 

  getTransfer() {
    this.transferService.getTransfersById(this.id)
    .subscribe((data: Transfers) => {
      const transfer = data;
     
      this.materials = transfer.details;
      
      this.formTransfer.patchValue({
        date: transfer.date,
        transferNumber: transfer.transferNumber,
        origin: transfer.origin,
        destination: transfer.destination,
        autorization: transfer.autorization,
        delivery: transfer.delivery,
        documentdelivery: transfer.documentdelivery,
        receive: transfer.receive,
        documentreceive: transfer.documentreceive,
        observation: transfer.observation,
        
      });
      transfer.details.forEach((material: Material) => {        
        this.createDetailTransferDto.push(
          this.formBuilder.group({
            name: [material.name, Validators.required],
            quantity: [material.quantity, [Validators.required, Validators.min(1)]],
            serie: [material.serial],
            observation: [material.observation]
          })
        );
      });
    });
  }
    
  addTransfer() {  
    
    console.log(this.formTransfer.value);
    
        
    if (this.formTransfer.valid) {
      const newExit: Transfers = {
        date: this.formTransfer.value.date,
        transferNumber: this.formTransfer.value.transferNumber,
        origin: this.formTransfer.value.origin,
        destination: this.formTransfer.value.destination,
        autorization: this.formTransfer.value.autorization.toUpperCase(),
        delivery: this.formTransfer.value.delivery,
        documentdelivery: this.formTransfer.value.documentdelivery.toString(),
        receive: this.formTransfer.value.receive,
        observation: this.formTransfer.value.observation,
        documentreceive: this.formTransfer.value.documentreceive.toString(),
        createDetailTransferDto: this.materials
      };
      
      
      if (this.id != '') {

        //editar
        
        const {id ,...rest} = newExit
        console.log(rest);
        
        
        this.transferService.updateTransfers(this.id, rest)        
        .subscribe({
          next: () => {
            this.showNotification(
              '¡Éxito!',
              'Traslado Actualizado con éxito:',
              'success'
            );
            this.router.navigate(['dashboard/list-trasfers']);
          },
          error: (error) => {
            this.handleError(error);
          }
        });

      } else {
        
        this.transferService.saveTransfers(newExit)
      .subscribe({
        next: () => {
          this.showNotification(
            '¡Éxito!',
            'Traslado Agregado con éxito:',
            'success'
          );
          this.router.navigate(['dashboard/list-trasfers']);
        },
        error: (error) => {
          this.handleError(error);
        }
      });
      }
      
    }
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
