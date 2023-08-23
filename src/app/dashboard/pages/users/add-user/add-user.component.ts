import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { FormGroup, Validators, FormBuilder,
  FormsModule, ReactiveFormsModule, AbstractControl} from '@angular/forms';

import { UsersService } from '../../../services/users.service';
import { ValidatorsService } from '../../../services/Validate.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { UiModulesModule } from '../../../components/ui-modules/ui-modules.module';
import { Warehouse } from 'src/app/dashboard/interfaces/warehouseInterface';
import { WarehousesService } from 'src/app/dashboard/services/warehouses.service';

@Component({
  selector: 'add-user',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, ReactiveFormsModule, UiModulesModule],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class  AddUserComponent  {
  options = [
    { id: 'activo', value: true, label: 'Activo' },
    { id: 'inactivo', value: false, label: 'Inactivo' }
  ];
  public warehouses : Warehouse[];
  hide = true;
  hiden = true;


  public formulario: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^[a-zA-ZáéíóúñÁÉÍÓÚüÜ\s]+ [a-zA-ZáéíóúñÁÉÍÓÚüÜ\s]+$/)]],
    user: ['', [Validators.required, Validators.minLength(5)]],
    rol: ['', [Validators.required, Validators.minLength(5)]],
    warehouse: ['', [Validators.required, Validators.minLength(5)]],
    status: ['', [Validators.required, Validators.minLength(5)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    repeat_password: ['', [Validators.required, this.matchPassword.bind(this)]],
  });


  constructor(private fb: FormBuilder,
    private validatorsService: ValidatorsService,
    private warehouseService: WarehousesService,
    private router: Router,
    private userService: UsersService) { }

    ngOnInit() {
      this.getListWarehouses(); // Obtener los datos de la tabla desde un servicio
    }
    getListWarehouses() {      
      this.warehouseService.getWarehouses()
        .subscribe((data: any) => {
          this.warehouses = data.warehouses;          
        });
    }

  isValidField(field: string) {
    return this.validatorsService.isValidField(this.formulario, field);
  }

  matchPassword(control: AbstractControl): {[key: string]: boolean} | null {
    const password = control.root.get('password');
    const repeat_password = control.value;
    if (password && repeat_password !== password.value) {
      return { 'mismatch': true };
    }
    return null;
  }

    

    async onSubmit() {
      this.formulario.markAllAsTouched();
      const formValues = this.formulario.value;

      try {
        await this.userService.register(formValues);
        this.showNotification('¡Éxito!', 'Usuario agregado con éxito:', 'success');
        this.formulario.reset();
              this.router.navigate(['dashboard/list-users']);
            
      } catch (error: any) { // Agregamos la declaración de tipo "any"
        if (error.status == 0) {
          // Error de conexión
          this.showNotification('¡Error!', 'Hubo un error de conexión con el servidor.', 'error');
        } else if (error.error.errors) {
          // Errores de validación del formulario
          const errores = error.error.errors;
          errores.forEach((error: { msg: any; }) => {
            this.showNotification('¡Error!', error.msg, 'error');
          });
        } else if (error.error.msg === 'El Usuario ya existe, ingrese uno diferente') {
          // Usuario ya existe
          this.showNotification('¡Error!', 'El usuario ya existe en la base de datos. Ingrese uno diferente.', 'error');
        } else {
          // Otro tipo de error
          this.showNotification('¡Error!', error.error.msg, 'error');
        }
      }
    }

    showNotification(title: string, message: string, icon: string) {
      Swal.fire({
        icon: icon as SweetAlertIcon, // Convertimos el parámetro "icon" a un tipo SweetAlertIcon
        title: title,
        text: message
      });
    }


}


