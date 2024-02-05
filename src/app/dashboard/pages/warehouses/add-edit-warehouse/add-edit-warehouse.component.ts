import { UiModulesModule } from 'src/app/dashboard/components/ui-modules/ui-modules.module';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidatorsService } from 'src/app/dashboard/services/Validate.service';
import { WarehousesService } from '../../../services/warehouses.service';
import { Warehouse } from 'src/app/dashboard/interfaces/warehouseInterface';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-add-edit-warehouse',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,UiModulesModule],
  templateUrl: './add-edit-warehouse.component.html',
  styleUrls: ['./add-edit-warehouse.component.css']
})
export class AddEditWarehouseComponent {

  form: FormGroup;
  id: string ;
  operation: string = 'Agregar ';

  constructor(private fb:FormBuilder,
    private router:Router,
    private wareHousesService: WarehousesService,
    private validatorsService: ValidatorsService,
    private aRouter: ActivatedRoute

    ){
      this.form = this.fb.group({
        name: ['', Validators.required],
        date: ['', Validators.required],
      });
      this.id = this.aRouter.snapshot.paramMap.get('id')?? '';
  }

  isValidField(field: string) {
    return this.validatorsService.isValidField(this.form, field);
  }

  ngOnInit(): void {
    if (this.id != '') {
      // Es editar
      this.operation = 'Editar ';
      this.getWarehouse(this.id);
    }
  }

  getWarehouse(id: string) {
    this.wareHousesService.getWarehouseById(id)
    .subscribe((data: Warehouse) => {
      const formattedDate = new Date(data.date).toISOString().slice(0, 16); // Formatear la fecha y hora
      this.form.setValue({
        name: data.name,
        date: formattedDate,
      });
    }); 
  }

  addWarehouse() {
    /*  console.log(this.form.value.name);
     console.log(this.form.get('name')?.value); */

    const warehouse: Warehouse = {
      name: this.form.value.name,
      date: this.form.value.date,

    };

    if (this.id !== '') {
      // Es editar
      warehouse.id = this.id;
      const {id, ...rest } = warehouse
       this.wareHousesService.updateWarehouse(this.id, rest)
       .subscribe({

        next: () => {
        this.showNotification(
          '¡Éxito!',
          'Bodega actualizada con éxito:',
          'success'
        );
        this.router.navigate(['dashboard/list-warehuses']);
      },
      error: (error) => {
        this.handleError(error);
      }
      });
    } else {
      // Es agregagar
      const {id, ...rest } = warehouse
      this.wareHousesService.saveWarehouse(rest)
      .subscribe({
        next: () => {
        this.showNotification(
          '¡Éxito!',
          'Bodega Agregada con éxito:',
          'success'
        );
        this.router.navigate(['dashboard/list-warehuses']);
      },
      error: (error) => {
        //console.log(error);
        
        this.handleError(error);
      }
      });
    }
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
      const errores = error.error.message;   
         
                     
      let mensajeError = '';
      errores.forEach((error: { message: any; }, index: number) => {      
         mensajeError += `${index + 1}. ${error}\n`;
      });
      this.showNotification('¡Error!', mensajeError, 'error');
      
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
