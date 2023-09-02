import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorsService } from 'src/app/dashboard/services/Validate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TransferServiceService } from 'src/app/dashboard/services/transfer-service.service';
import { CollaboratorService } from 'src/app/dashboard/services/list-collaborator.service';
import { Collaborator } from 'src/app/dashboard/interfaces/collaboratorInterface';
import { Material, Transfers } from 'src/app/dashboard/interfaces/transferInterface';
import { MaterialDetailsComponent } from '../../material-details/material-details.component';

@Component({
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, MaterialDetailsComponent],
  templateUrl: './add-edit-transfer.component.html',
  styleUrls: ['./add-edit-transfer.component.css']
})
export class AddEditTransferComponent {

  materials:Material [] = [];
  formTransfer: FormGroup;
  id: string ;
  materialTransferDetail: FormArray;
  mode: string = 'Agregar '; 
  public collaborator: Collaborator[];


 
  constructor(
    private formBuilder: FormBuilder,
    private aRouter: ActivatedRoute,
    private router:Router,
    private collaboratorService: CollaboratorService,
    private transferService:TransferServiceService,
     private validatorsService:ValidatorsService) { 
    this.formTransfer = this.formBuilder.group({
      date: ['', Validators.required],
      transferNumber: ['', Validators.required],
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      autorization: ['', Validators.required],
      delivery: ['', Validators.required],
      documentdelivery: ['', Validators.required],
      receive: ['', Validators.required],
      documentreceive: ['', Validators.required],
      materialTransferDetail: this.formBuilder.array([])
        });
        this.materialTransferDetail = this.formTransfer.get('materialTransferDetail') as FormArray;
        this.id = this.aRouter.snapshot.paramMap.get('id')?? '';
  }

  ngOnInit(): void {
    this.getListCollaborator()
    if (this.id != '') {
      // Es editar
     this.mode = 'Editar ';
      this.getTransfer(this.id);
    }
  }

  getListCollaborator(){
    this.collaboratorService.getCollaborators()
    .subscribe((data:any) =>{      
      this.collaborator = data.collaborator;
      
  });
  }

  isValidField(field: string) {
    return this.validatorsService.isValidField(this.formTransfer, field);
  }

  onMaterialsChange(materials: any[]) {
    this.materials = materials;
  }

  onCollaboratorSelect() {
    const selectedCollaborator = this.collaborator.find(collaborator => collaborator.name === this.formTransfer.value.delivery);
    if (selectedCollaborator) {
      this.formTransfer.patchValue({
        documentdelivery: selectedCollaborator.document,       
      });
    }
    const selectedCollaborator2 = this.collaborator.find(collaborator => collaborator.name === this.formTransfer.value.receive);
    if (selectedCollaborator2) {
      this.formTransfer.patchValue({        
        documentreceive: selectedCollaborator2.document,
        
      });
    }
  }



 

  getTransfer(id: string) {
    this.transferService.getTransfersById(id)
    .subscribe((data: any) => {
      const exit = data.transfer;
      this.materials = exit.materialTransferDetail;
      console.log(exit);
      
      this.formTransfer.setValue({
        date: exit.date,
        transferNumber: exit.transferNumber,
        origin: exit.origin,
        destination: exit.destination,
        autorization: exit.autorization,
        delivery: exit.delivery,
        documentdelivery: exit.documentdelivery,
        receive: exit.receive,
        documentreceive: exit.documentreceive,
        materialTransferDetail: []
      });
      exit.materialTransferDetail.forEach((material: any) => {
        this.materialTransferDetail.push(
          this.formBuilder.group({
            name: [material.name, Validators.required],
            quantity: [material.quantity, [Validators.required, Validators.min(1)]],
            serie: [material.serie],
            observaciones: [material.observaciones]
          })
        );
      });
    });
  }
    
  addTransfer() {
    if (this.formTransfer.valid) {
      const newExit:Transfers = {
        date: this.formTransfer.value.date,
        transferNumber: this.formTransfer.value.transferNumber,
        origin: this.formTransfer.value.origin,
        destination: this.formTransfer.value.destination,
        autorization: this.formTransfer.value.autorization,
        delivery: this.formTransfer.value.delivery,
        documentdelivery: this.formTransfer.value.documentdelivery,
        receive: this.formTransfer.value.receive,
        documentreceive: this.formTransfer.value.documentreceive,
        materialTransferDetail: this.materials,
        
      };

      if (this.id != '') {
        //editar
        newExit.id = this.id;
        this.transferService.updateTransfers(this.id, newExit)
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
    if (error.status == 0) {
      // Error de conexión
      this.showNotification('¡Error!', 'Hubo un error de conexión con el servidor.', 'error');
    } else if (error.error.errors) {
      // Errores de validación del formulario
      const errores = error.error.errors;
      errores.forEach((error: { msg: any; }) => {
        this.showNotification('¡Error!', error.msg, 'error');
      });
    } else if (error.error.msg === 'El Entrada ya existe, ingrese uno diferente') {
      // Usuario ya existe
      this.showNotification('¡Error!', 'El Entrada ya existe en la base de datos. Ingrese uno diferente.', 'error');
    } else {
      // Otro tipo de error
      this.showNotification('¡Error!', error.error.msg, 'error');
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
