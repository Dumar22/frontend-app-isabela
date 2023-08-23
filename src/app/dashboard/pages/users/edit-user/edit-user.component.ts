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
    private _userService: UsersService,
    private warehouseService: WarehousesService,
    private router: Router,
    private validatorsService: ValidatorsService,
    private route: ActivatedRoute){
     this.formulario = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^[a-zA-ZáéíóúñÁÉÍÓÚüÜ\s]+ [a-zA-ZáéíóúñÁÉÍÓÚüÜ\s]+$/)]],
      user: ['', [Validators.required, Validators.minLength(5)]],
      rol: ['', [Validators.required, Validators.minLength(5)]],
      warehouse: ['', [Validators.required, Validators.minLength(5)]],
      status: ['', [Validators.required, Validators.minLength(5)]],
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

    getListWarehouses() {      
      this.warehouseService.getWarehouses()
        .subscribe((data: any) => {
          this.warehouses = data.warehouses;          
        });
    }

    getUser(id: string) {
      this.loading = true;
      this._userService.getUser(id).subscribe(
        (data: UserForm) => {
          this.loading = false;
          this.formulario.setValue({
            name: data.name,
            user: data.user,
            rol: data.rol,
            warehouse: data.warehouse,
            status: data.status,
           })
          })
        }


        addUser() {
           const user: UserForm = {
            name: this.formulario.value.name,
            user: this.formulario.value.user,
            rol: this.formulario.value.rol,
            warehouse: this.formulario.value.warehouse,
            status: this.formulario.value.status
          }
          this.loading = true;

           // Es editar
            user.id = this.id;
            this._userService.updateUser(this.id, user).subscribe(() => {
              // alert(`El producto ${user.name} fue actualizado con exito`);
              this.showNotification('¡Éxito!', 'Usuario actualizado con éxito:', 'success');

              this.loading = false;
              this.router.navigate(['dashboard/list-users']);
            })
        }

        showNotification(title: string, message: string, icon: string) {
          Swal.fire({
            icon: icon as SweetAlertIcon, // Convertimos el parámetro "icon" a un tipo SweetAlertIcon
            title: title,
            text: message
          });
        }


  }




