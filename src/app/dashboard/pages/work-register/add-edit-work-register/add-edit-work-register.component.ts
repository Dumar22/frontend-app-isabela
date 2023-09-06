import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  public warehouse : string ;
  operation: string = 'Agregar ';

 
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private workRegisterService: WorkRegisterService,    
    private aRouter: ActivatedRoute
  ) {
    this.form = this.fb.group({
      registration: ['', Validators.required],
      name: ['', Validators.required],
      ot: ['', Validators.required],      
      address: ['', Validators.required],
      phone: ['', Validators.required],     
      
    });
    this.id = this.aRouter.snapshot.paramMap.get('id')?? '';      
  }

  

  ngOnInit(): void {
    const user = this.authService.currentUser
    this.warehouse = user().warehouse;

    if (this.id != '') {
      // Es editar
     this.operation = 'Editar ';
      this.getWorInstall(this.id);
    }
  }

  getWorInstall(id: string) {    
    this.workRegisterService.getWorkRegisterById(id)
    .subscribe((data: any) => {
      const workRegister = data.workInstall;      
      this.form.setValue({
        registration: workRegister.registration,
        name: workRegister.name,
        ot: workRegister.ot,        
        address: workRegister.address,
        phone: workRegister.phone,
            
      });
    });
  }

  addWorkRegister() {
    
    const workRegister: WorkRegister = {
      registration: this.form.value.registration,
      name: this.form.value.name,
      ot: this.form.value.ot,     
      address: this.form.value.address,
      phone: this.form.value.phone,   
    
    };

    if (this.id !== '') {
      // Es editar
      workRegister.id = this.id;
      this.workRegisterService.updateWorkRegister(this.id, workRegister)
      .subscribe({
        next: () => {
          this.showNotification(
            '¡Éxito!',
            'Matricula Actualizada con éxito:',
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
      this.workRegisterService.saveWorkRegister(workRegister)
      .subscribe({
        next: () => {
          this.showNotification(
            '¡Éxito!',
            'Matricula Agregada con éxito:',
            'success'
          );
        this.router.navigate(['dashboard/list-work-register']);
      },
      error: (error) => {
        this.handleError(error);
      }
    });
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
    } else if (error.error.msg === 'La matricula ya existe, ingrese una diferente') {
      // Usuario ya existe
      this.showNotification('¡Error!', 'La matricula ya existe en la base de datos. Ingrese una diferente.', 'error');
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
