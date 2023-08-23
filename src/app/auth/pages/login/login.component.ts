import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiModulesModule } from 'src/app/dashboard/components/ui-modules/ui-modules.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorsService } from 'src/app/dashboard/services/Validate.service';
import { Router } from '@angular/router';
import { inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

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
    user: ['administrador 1', [Validators.required, Validators.minLength(5)]],
    password: ['123456', [Validators.required, Validators.minLength(6)]]   
  });


 

  isValidField(field: string) {
    return this.validatorsService.isValidField(this.formulario, field);
  }



  onSubmit(){
    const { user, password } = this.formulario.value

    this.authService.login(user, password)
    .subscribe( {
         next: () => this.router.navigateByUrl('/dashboard'),
         error: (message) =>{
          Swal.fire('Error', message, 'error')
         }
         
          
       
    })    
  }

}
