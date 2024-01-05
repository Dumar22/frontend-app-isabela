import { UiModulesModule } from '../../../components/ui-modules/ui-modules.module';
import { UsersService } from '../../../services/users.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserForm } from '../../../interfaces/usersInterface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorsService } from 'src/app/dashboard/services/Validate.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Warehouse } from 'src/app/dashboard/interfaces/warehouseInterface';
import { WarehousesService } from 'src/app/dashboard/services/warehouses.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiModulesModule],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

options = [
  { id: 'activo', value: true, label: 'Activo' },
  { id: 'inactivo', value: false, label: 'Inactivo' }
];
  formulario: FormGroup;
  loading: boolean = false;
  id: string;
  warehouses: Warehouse[];
  operation: string = 'Agregar ';
  hide = true;
  hiden = true;

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private warehouseService: WarehousesService,
    private router: Router,
    private validatorsService: ValidatorsService,
    private route: ActivatedRoute){

     this.formulario = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^[a-zA-ZáéíóúñÁÉÍÓÚüÜ\s]+ [a-zA-ZáéíóúñÁÉÍÓÚüÜ\s]+$/)]],
      user: ['', [Validators.required, Validators.minLength(5)]],
      rol: [[], Validators.required],     
      warehouseIds: [[], Validators.required],
      // isActive: ['', [Validators.required, Validators.minLength(5)]],
    })
    this.id = String(route.snapshot.paramMap.get('id'));
    }


    isValidField(field: string) {
      return this.validatorsService.isValidField(this.formulario, field);
    }



    ngOnInit(): void {

      if (this.id != '') {
              this.operation = 'Editar ';
        this.getUser(this.id);
      }
      this.getListWarehouses(); // Obtener los datos de la tabla desde un servicio
    }

    async getListWarehouses() {      
      await this.warehouseService.getWarehouses()
        .subscribe((data: Warehouse[]) => {                   
          this.warehouses = data;          
        });
    }

    getUser(id: string) {

      this.loading = true;
      this.userService.getUserById(id)
      .subscribe((data:any ) => { 
      
              
          this.formulario.setValue({
            fullName: data.fullName,
            user: data.user,
            rol: data.rol[0],            
            // isActive: data.isActive,
            warehouseIds: data.warehouses[0].id,
           })
          })
        }


        addUser(id: string) {
          const selectedRol = this.formulario.get('rol').value; // Obtener el valor del campo "rol"
    const rolesArray = [selectedRol];
    const selectedWarehouseIds = this.formulario.get('warehouseIds').value; // Obtener el valor del campo "rol"
    const warehouseArray = [selectedWarehouseIds];

    const user: UserForm = {
      fullName: this.formulario.value.fullName,
            user: this.formulario.value.user,
            rol: rolesArray,            
            warehouseIds: warehouseArray,
            // isActive: this.formulario.value.isActive
           
    };
   
    this.userService.updateUser( id, user)
      .subscribe({
        next: () => {
          this.showNotification(
            '¡Éxito!',
            'Usuario Actualizado con éxito:',
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




