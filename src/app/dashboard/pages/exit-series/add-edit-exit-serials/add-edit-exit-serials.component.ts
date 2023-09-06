import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExitReg, Material } from 'src/app/dashboard/interfaces/exitRegisterInterface';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Collaborator } from 'src/app/dashboard/interfaces/collaboratorInterface';
import { ActivatedRoute, Router } from '@angular/router';
import { CollaboratorService } from 'src/app/dashboard/services/list-collaborator.service';
import { ExitRegisterService } from 'src/app/dashboard/services/exit-register.service';
import { ValidatorsService } from 'src/app/dashboard/services/Validate.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { MaterialDetailsComponent } from '../../material-details/material-details.component';
import { WorkRegister } from 'src/app/dashboard/interfaces/workRegisterInterface';
import { WorkRegisterService } from 'src/app/dashboard/services/work-install.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,MaterialDetailsComponent],
  templateUrl: './add-edit-exit-serials.component.html',
  styleUrls: ['./add-edit-exit-serials.component.css']
})
export class AddEditExitSerialsComponent {

  public materials: Material[] = [];
  public formExit: FormGroup;
  public id: string ;
  public materialExitRegisterDetail: FormArray;
  public mode: string = 'Agregar '; 
  public collaborator: Collaborator[];
  public workRegister: WorkRegister[];
  public selectedWorkRegister: any
  public workInstallName: string ='';
  public workInstallOrder: string ='';
  public workInstallAddress: string ='';
  public types = [
    { name: 'Proyectos'},
    { name: 'Internas'},
    { name: 'Adicionales'},
  ]
 
  constructor(
    private formBuilder: FormBuilder,
    private aRouter: ActivatedRoute,
    private router:Router,
    private collaboratorService: CollaboratorService,
    private workRegisterService: WorkRegisterService,
    private exitService:ExitRegisterService,
     private validatorsService:ValidatorsService) { 
    this.formExit = this.formBuilder.group({
      date: ['', Validators.required],
      type: ['', Validators.required],
      exitNumber: ['', Validators.required],
      collaboratorCode: ['', Validators.required],
      collaboratorName: ['', Validators.required],
      collaboratorDocument: ['', Validators.required],
      collaboratorOperation: ['', Validators.required],
      workInstallId: ['', Validators.required],
      materialExitRegisterDetail: this.formBuilder.array([])
        });
        this.materialExitRegisterDetail = this.formExit.get('materialExitRegisterDetail') as FormArray;
        this.id = this.aRouter.snapshot.paramMap.get('id')?? '';
  }

  ngOnInit(): void {
    this.getListCollaborator()
    this.getListWorkRegister()
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
  getListWorkRegister(){
    this.workRegisterService.getWorkRegister()
    .subscribe((data:any) =>{      
      this.workRegister = data.workInstall;
      
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

  onWorkRegisterSelect() {
    const workRegisterId = this.formExit.get('workInstallId').value;
    this.selectedWorkRegister = this.workRegister.find(workRegister => workRegister.id === workRegisterId);        
    this.workInstallName = this.selectedWorkRegister.name;
    this.workInstallOrder = this.selectedWorkRegister.ot;
    this.workInstallAddress = this.selectedWorkRegister.address;
  }

 

  getExit(id: string) {
    this.exitService.getExitById(id)
    .subscribe((data: any) => {          
      const exit = data.exit;
      //console.log(exit);      
      this.materials = exit.materialExitRegisterDetail;
      
      this.formExit.setValue({
        date: exit.date,
        type: exit.type,
        exitNumber: exit.exitNumber,
        collaboratorCode: exit.collaboratorCode,
        collaboratorName: exit.collaboratorName,
        collaboratorDocument: exit.collaboratorDocument,
        collaboratorOperation: exit.collaboratorOperation,
        workInstallId: exit.workInstallId,
        materialExitRegisterDetail: []
      });
      exit.materialExitRegisterDetail.forEach((material: any) => {
        this.materialExitRegisterDetail.push(
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

      const newExit:ExitReg = {
        date: this.formExit.value.date,
        type: this.formExit.value.type,
        exitNumber: this.formExit.value.exitNumber,
        collaboratorCode: this.formExit.value.collaboratorCode,
        collaboratorName: this.formExit.value.collaboratorName,
        collaboratorDocument: this.formExit.value.collaboratorDocument,
        collaboratorOperation: this.formExit.value.collaboratorOperation,
        workInstallId: this.formExit.value.workInstallId,
        materialExitRegisterDetail: this.materials,
        warehouse: ''
      };
      console.log(newExit);
      

      if (this.id != '') {
        //editar
        newExit.id = this.id;
        this.exitService.updateExit(this.id, newExit)
        .subscribe({
          next: () => {
            this.showNotification(
              '¡Éxito!',
              'Salida Actualizada con éxito:',
              'success'
            );
            this.router.navigate(['dashboard/list-exit-register']);
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
            'Salida Agregada con éxito:',
            'success'
          );
          this.router.navigate(['dashboard/list-exit-register']);
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
