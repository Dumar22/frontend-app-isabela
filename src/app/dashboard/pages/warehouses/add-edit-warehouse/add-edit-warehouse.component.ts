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
      this.form.setValue({
        name: data.name,
      });
    });
  }

  addWarehouse() {
    /*  console.log(this.form.value.name);
     console.log(this.form.get('name')?.value); */

    const warehouse: Warehouse = {
      name: this.form.value.name,

    };

    if (this.id !== '') {
      // Es editar
      warehouse.id = this.id;
       this.wareHousesService.updateWarehouse(this.id, warehouse).subscribe(() => {
        this.showNotification(
          '¡Éxito!',
          'Bodega actualizada con éxito:',
          'success'
        );
        this.router.navigate(['dashboard/list-warehuses']);
      });
    } else {
      // Es agregagar
      this.wareHousesService.saveWarehouse(warehouse).subscribe(() => {
        this.showNotification(
          '¡Éxito!',
          'Bodega Agregado con éxito:',
          'success'
        );
        this.router.navigate(['dashboard/list-warehuses']);
      });
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
