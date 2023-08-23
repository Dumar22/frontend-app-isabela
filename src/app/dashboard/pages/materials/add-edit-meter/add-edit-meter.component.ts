import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MetersService } from 'src/app/dashboard/services/meters.service';
import { Meter } from 'src/app/dashboard/interfaces/metersInterface';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { UiModulesModule } from 'src/app/dashboard/components/ui-modules/ui-modules.module';

@Component({
  selector: 'add-edit-meter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiModulesModule],
  templateUrl: './add-edit-meter.component.html',
  styleUrls: ['./add-edit-meter.component.css']
})
export class AddEditMeterComponent {
  form: FormGroup;
  id: string ;
  public warehouse : string ;
  operation: string = 'Agregar ';

  options = [
    { id: 'disponible', value: true, label: 'Disponible' },
    { id: 'no-disponible', value: false, label: 'No disponible' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private meterService: MetersService,    
    private aRouter: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      unity: ['', Validators.required],      
      quantity: ['', Validators.required],
      value: ['', Validators.required],     
      serial: ['', Validators.required],     
      warehouse: [this.warehouse, Validators.required],
      available: [false],
    });
    this.id = this.aRouter.snapshot.paramMap.get('id')?? '';
    this.form.get('quantity').valueChanges.subscribe((value) => {
      if (value >= 1) {
        this.form.get('available').setValue(true);
      } else{
        this.form.get('available').setValue(false);
      }
    });  
  }

  nonNegativeValidator(control: AbstractControl): {[key: string]: any} | null {
    const value = control.value;
    if (value != null && value < 0) {
      return {'nonNegative': true};
    }
    return null;
  }

  ngOnInit(): void {
    const user = this.authService.currentUser
    this.warehouse = user().warehouse;

    if (this.id != '') {
      // Es editar
     this.operation = 'Editar ';
      this.getMeter(this.id);
    }
  }

  getMeter(id: string) {    
    this.meterService.getMeterById(id)
    .subscribe((data: any) => {
      const meter = data.meter;      
      this.form.setValue({
        name: meter.name,
        code: meter.code,
        unity: meter.unity,        
        quantity: meter.quantity,
        value: meter.value,
        serial: meter.serial,
        warehouse: this.warehouse,
        available: meter.available,        
      });
    });
  }

  addMeter() {
    
    const meter: Meter = {
      name: this.form.value.name,
      code: this.form.value.code,
      unity: this.form.value.unity,     
      quantity: this.form.value.quantity,
      value: this.form.value.value,   
      serial: this.form.value.serial,
      warehouse: this.warehouse,
      available: this.form.value.available,
    };

    if (this.id !== '') {
      // Es editar
      meter.id = this.id;
      this.meterService.updateMeter(this.id, meter)
      .subscribe({
        next: () => {
          this.showNotification(
            '¡Éxito!',
            'Medidor Actualizado con éxito:',
            'success'
          );
        this.router.navigate(['dashboard/list-meters']);
      },
      error: (error) => {
        this.handleError(error);
      }
    });
    } else {
      // Es agregagar
      this.meterService.saveMeter(meter)
      .subscribe({
        next: () => {
          this.showNotification(
            '¡Éxito!',
            'Medidor Agregado con éxito:',
            'success'
          );
        this.router.navigate(['dashboard/list-meters']);
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
    } else if (error.error.msg === 'El Medidor ya existe, ingrese uno diferente') {
      // Usuario ya existe
      this.showNotification('¡Error!', 'El Medidor ya existe en la base de datos. Ingrese uno diferente.', 'error');
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
