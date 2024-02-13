import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiModulesModule } from 'src/app/dashboard/components/ui-modules/ui-modules.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorsService } from 'src/app/dashboard/services/Validate.service';
import { Router } from '@angular/router';
import { inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, UiModulesModule, ReactiveFormsModule, UiModulesModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  private fb = inject( FormBuilder );
  private validatorsService = inject( ValidatorsService );
  private authService = inject( AuthService );
  private router = inject( Router );


  public formulario: FormGroup = this.fb.group({
    user: ['', [Validators.required, Validators.minLength(5)]],
    password: ['', [Validators.required, Validators.minLength(6)]]   
  });


 

  isValidField(field: string) {
    return this.validatorsService.isValidField(this.formulario, field);
  }



  onSubmit(){
    const { user, password } = this.formulario.value

    this.authService.login(user, password)
    .subscribe( {
         next: () => {
          this.router.navigate(['/dashboard']);
        },
         error: (error) => {        
          this.handleError(error);
         }
    })    
  }


  handleError(error: any) {
    if (error.status === 0) {
      // Error de conexión
      this.showNotification('¡Error!', 'Hubo un error de conexión con el servidor.', 'error');
    } else if (error.status === 500) {
      // Error de conexión     
      this.showNotification('¡Error!', 'Internal Server Error.', 'error');
    }
    
    else if (error) {
      // Errores de validación del formulario
      const errors = error.error.message;     
      this.showNotification('¡Error!',errors, 'error');
      
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
