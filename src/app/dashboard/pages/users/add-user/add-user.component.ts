import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FormGroup, Validators, FormBuilder,
  FormsModule, ReactiveFormsModule, AbstractControl, FormArray} from '@angular/forms';

import { UsersService } from '../../../services/users.service';
import { ValidatorsService } from '../../../services/Validate.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { UiModulesModule } from '../../../components/ui-modules/ui-modules.module';
import { Warehouse } from 'src/app/dashboard/interfaces/warehouseInterface';
import { WarehousesService } from 'src/app/dashboard/services/warehouses.service';
import { UserForm } from 'src/app/dashboard/interfaces/usersInterface';

@Component({
  selector: 'add-user',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, ReactiveFormsModule, UiModulesModule],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class  AddUserComponent  {
  //userForm: FormGroup;
  warehouses: Warehouse[]
  operation: string = 'Agregar ';
  options = [
    { id: 'activo', value: true, label: 'Activo' },
    { id: 'inactivo', value: false, label: 'Inactivo' }
  ];

  public userForm: FormGroup = this.formBuilder.group({
    fullName: ['', [Validators.required, Validators.minLength(5)]],
    user: ['', [Validators.required, Validators.minLength(5)]],
    password: ['', [Validators.required, Validators.minLength(5)]],
    rol: [[], Validators.required],
    warehouseIds: [[], Validators.required],
  });
  
 

  constructor(private formBuilder: FormBuilder, 
    private userService: UsersService,
    private router: Router,
    private validatorsService: ValidatorsService,
    private warehouseService: WarehousesService,) { }    

  ngOnInit(): void {
    this.getListWarehouses();   
  }  

 getListWarehouses() {      
  this.warehouseService.getWarehouses()
      .subscribe((data: Warehouse[]) => {                   
        this.warehouses = data;          
      });
  }

  
  

  onSubmit() {

    const selectedRol = this.userForm.get('rol').value; // Obtener el valor del campo "rol"
    const rolesArray = [selectedRol];
    const selectedWarehouseIds = this.userForm.get('warehouseIds').value; // Obtener el valor del campo "rol"
    const warehouseArray = [selectedWarehouseIds];

    const user: UserForm = {
      fullName: this.userForm.value.fullName,
            user: this.userForm.value.user,
            rol: rolesArray,
            password: this.userForm.value.password,
            warehouseIds: warehouseArray,
           
    };

    
    
    this.userService.register(user)
      .subscribe({
        next: () => {
          this.showNotification(
            '¡Éxito!',
            'Usuario agregado con éxito:',
            'success'
          );
        this.router.navigate(['dashboard/list-users']);
      },
      error: (error) => {
        this.handleError(error);
      }
    });
    
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

