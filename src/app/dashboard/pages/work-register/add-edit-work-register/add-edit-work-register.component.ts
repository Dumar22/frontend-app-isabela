import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { WorkRegisterService } from 'src/app/dashboard/services/work-install.service';
import { WorkRegister } from 'src/app/dashboard/interfaces/workRegisterInterface';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-edit-work-register.component.html',
  styleUrls: ['./add-edit-work-register.component.css']
})
export class AddEditWorkRegisterComponent {

  form: FormGroup;
  id: string ;
  public warehouses : string ;
  operation: string = 'Agregar ';

  typeUnities = [
    { id: 'PENDIENTE', value: 'PENDIENTE' },
    { id: 'RECHAZADA', value: 'RECHAZADA' },
    { id: 'COMPLETA', value: 'COMPLETA' },
    
  ];

 
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private workRegisterService: WorkRegisterService,    
    private aRouter: ActivatedRoute
  ) {
    this.form = this.fb.group({
      contract: ['', Validators.required],
      name: ['', Validators.required],
      ot: [ '' , Validators.required],      
      request: [ '' , Validators.required],      
      status: [ '' , Validators.required],      
      municipality: [ '' , Validators.required],      
      neighborhood: [ '' , Validators.required],      
      addres: ['', Validators.required],
      date: ['', Validators.required],
      phone: ['', Validators.required],     
      observation: ['', Validators.required],     
    });
    this.id = this.aRouter.snapshot.paramMap.get('id')?? '';      
  }

  isValidField(field: string) {
    return this.workRegisterService.isValidField(this.form, field);
  }
  

  ngOnInit(): void {
    const user = this.authService.currentUser
    this.warehouses = user().warehouses[0];

    if (this.id != '') {
      // Es editar
     this.operation = 'Editar ';
      this.getWorInstall(this.id);
    }
  }

  getWorInstall(id: string) {    
    this.workRegisterService.getWorkRegisterById(id)
    .subscribe((data: WorkRegister) => {  
              
      this.form.setValue({
        name: data.name,
        addres: data.addres,
        contract: data.contract,
        ot: data.ot,        
        request: data.request,        
        status: data.status,        
        municipality: data.municipality,        
        neighborhood: data.neighborhood,        
        date: data.date,        
        phone: data.phone,
        observation: data.observation    
      });
    });
  }

  addWorkRegister() {
    
    const workRegister: WorkRegister = {
      name: this.form.value.name,
      addres: this.form.value.addres,
      contract: this.form.value.contract,
      ot: this.form.value.ot,     
      request: this.form.value.request,     
      status: this.form.value.status,     
      municipality: this.form.value.municipality,     
      neighborhood: this.form.value.neighborhood,     
      date: this.form.value.date,     
      phone: this.form.value.phone,   
      observation: this.form.value.observation,   
      
    };

    console.log(workRegister);
    

    if (this.id !== '') {
      // Es editar
      workRegister.id = this.id;
      const {id, ...rest } = workRegister
      this.workRegisterService.updateWorkRegister(this.id, rest)
      .subscribe({
        next: () => {
          this.showNotification(
            '¡Éxito!',
            'Contrato Actualizado con éxito:',
            'success'
          );
        this.router.navigate(['dashboard/list-work-register']);
      },
      error: (error) => {
        this.handleError(error);
      }
    });
    } else {
      // Es agregagar
      const {id, ...rest } = workRegister
      this.workRegisterService.saveWorkRegister(rest)
      .subscribe({
        next: () => {
          this.showNotification(
            '¡Éxito!',
            'Contrato Agregado con éxito:',
            'success'
          );
        this.router.navigate(['dashboard/list-work-register']);
      },
      error: (error) => {
        //console.log(error);
        
        this.handleError(error);
      }
    });
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
