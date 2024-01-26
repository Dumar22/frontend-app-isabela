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
  public warehouses : string ;
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
      unity: ['UNIDAD', Validators.required],      
      quantity: ['', Validators.required],
      price: ['', Validators.required],     
      serial: ['', Validators.required],     
      brand: ['', Validators.required],     
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
    this.warehouses = user().warehouses[0];

    if (this.id != '') {
      // Es editar
     this.operation = 'Editar ';
      this.getMeter(this.id);
    }
  }

  getMeter(id: string) {    
    this.meterService.getMeterById(id)
    .subscribe((data: Meter) => {
      const meter = data;      
      this.form.setValue({
        name: meter.name,
        code: meter.code,
        unity: meter.unity,        
        quantity: meter.quantity,
        price: meter.price,
        serial: meter.serial,
        brand: meter.brand,        
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
      price: this.form.value.price,   
      serial: this.form.value.serial,
      brand: this.form.value.brand,
      available: this.form.value.available,
    };

    if (this.id !== '') {
      // Es editar
      meter.id = this.id;
      const {id, ...rest } = meter
      this.meterService.updateMeter(this.id, rest)
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
