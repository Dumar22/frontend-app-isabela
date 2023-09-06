import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialDetailsComponent } from '../../material-details/material-details.component';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { ValidatorsService } from 'src/app/dashboard/services/Validate.service';
import { Exit, Material } from 'src/app/dashboard/interfaces/exitInterfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { ExitService } from 'src/app/dashboard/services/exit.service';
import { Collaborator } from 'src/app/dashboard/interfaces/collaboratorInterface';
import { CollaboratorService } from 'src/app/dashboard/services/list-collaborator.service';

@Component({
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, MaterialDetailsComponent],
  templateUrl: './add-edit-materials.component.html',
  styleUrls: ['./add-edit-materials.component.css']
})
export class AddEditMaterialsComponent {

  materials: Material[] = [];
  formExit: FormGroup;
  id: string ;
  materialExitDetail: FormArray;
  mode: string = 'Agregar '; 
  public collaborator: Collaborator[];


 
  constructor(
    private formBuilder: FormBuilder,
    private aRouter: ActivatedRoute,
    private router:Router,
    private collaboratorService: CollaboratorService,
    private exitService:ExitService,
     private validatorsService:ValidatorsService) { 
    this.formExit = this.formBuilder.group({
      date: ['', Validators.required],
      exitNumber: ['', Validators.required],
      collaboratorCode: ['', Validators.required],
      collaboratorName: ['', Validators.required],
      collaboratorDocument: ['', Validators.required],
      collaboratorOperation: ['', Validators.required],
      materialExitDetail: this.formBuilder.array([])
        });
        this.materialExitDetail = this.formExit.get('materialExitDetail') as FormArray;
        this.id = this.aRouter.snapshot.paramMap.get('id')?? '';
  }

  ngOnInit(): void {
    this.getListCollaborator()
    if (this.id != '') {
      // Es editar
     this.mode = 'Editar ';
      this.getExit(this.id);
    }
  }

  getListCollaborator(){
    this.collaboratorService.getCollaborators()
    .subscribe((data:any) =>{      
      this.collaborator = data.collaborator;
      
  });
  }

  isValidField(field: string) {
    return this.validatorsService.isValidField(this.formExit, field);
  }

  onMaterialsChange(materials: any[]) {
    this.materials = materials;
  }

  onCollaboratorSelect() {
    const selectedCollaborator = this.collaborator.find(collaborator => collaborator.code === this.formExit.value.collaboratorCode);
    if (selectedCollaborator) {
      this.formExit.patchValue({
        collaboratorName: selectedCollaborator.name,
        collaboratorDocument: selectedCollaborator.document,
        collaboratorOperation: selectedCollaborator.operation,
      });
    }
  }



 

  getExit(id: string) {
    this.exitService.getExitById(id)
    .subscribe((data: any) => {
      const exit = data.exit;
      this.materials = exit.materialExitDetail;
      
      this.formExit.setValue({
        date: exit.date,        
        exitNumber: exit.exitNumber,
        collaboratorCode: exit.collaboratorCode,
        collaboratorName: exit.collaboratorName,
        collaboratorDocument: exit.collaboratorDocument,
        collaboratorOperation: exit.collaboratorOperation,
        materialExitDetail: []
      });
      exit.materialExitDetail.forEach((material: any) => {
        this.materialExitDetail.push(
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
    
  addExit() {
    if (this.formExit.valid) {
      const newExit:Exit = {
        date: this.formExit.value.date,
        exitNumber: this.formExit.value.exitNumber,
        collaboratorCode: this.formExit.value.collaboratorCode,
        collaboratorName: this.formExit.value.collaboratorName,
        collaboratorDocument: this.formExit.value.collaboratorDocument,
        collaboratorOperation: this.formExit.value.collaboratorOperation,
        materialExitDetail: this.materials,
        warehouse: ''
      };

      if (this.id != '') {
        //editar
        newExit.id = this.id;
        this.exitService.updateExit(this.id, newExit)
        .subscribe({
          next: () => {
            this.showNotification(
              '¡Éxito!',
              'Entrada Actualizada con éxito:',
              'success'
            );
            this.router.navigate(['dashboard/list-entries']);
          },
          error: (error) => {
            this.handleError(error);
          }
        });

      } else {
        this.exitService.saveExit(newExit)
      .subscribe({
        next: () => {
          this.showNotification(
            '¡Éxito!',
            'Entrada Agregada con éxito:',
            'success'
          );
          this.router.navigate(['dashboard/list-entries']);
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
