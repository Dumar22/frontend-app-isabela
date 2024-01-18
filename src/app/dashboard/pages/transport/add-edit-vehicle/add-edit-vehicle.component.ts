import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from 'src/app/dashboard/services/vehicle.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ValidatorsService } from 'src/app/dashboard/services/Validate.service';
import { Vehicle } from 'src/app/dashboard/interfaces/vehiclesInterface';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-edit-vehicle.component.html',
  styleUrls: ['./add-edit-vehicle.component.css']
})
export class AddEditVehicleComponent {

  form: FormGroup;
  id: string ;
  public warehouses : string ;
  operation: string = 'Agregar ';

  constructor(private fb:FormBuilder,
    private router:Router,
    private providerService: VehicleService,
    private authService: AuthService,
    private validatorsService: ValidatorsService,
    private aRouter: ActivatedRoute

    ){
      this.form = this.fb.group({
        make: ['', Validators.required],
        plate: ['', Validators.required],
        model: ['', Validators.required],
        status: ['' , Validators.required],
      });
      this.id = this.aRouter.snapshot.paramMap.get('id')?? '';
  }

  isValidField(field: string) {
    return this.validatorsService.isValidField(this.form, field);
  }

  ngOnInit(): void {

    const user = this.authService.currentUser
    this.warehouses = user().warehouses[0];

    if (this.id != '') {
      // Es editar
      this.operation = 'Editar ';
      this.getVehicle(this.id);
    }
  }

  getVehicle(id: string) {
    this.providerService.getVehicleById(id)
    .subscribe((data: Vehicle) => {
      this.form.setValue({
        make: data.make,
        model: data.model,
        plate: data.plate,
        status: data.status,
      });
    });
  }

  addVehicle() {
   
    const vehicle: Vehicle = {
      make: this.form.value.make,
      model: this.form.value.model,
      plate: this.form.value.plate,
      status: this.form.value.status,
    };
    
    if (this.id !== '') {
      // Es editar
      vehicle.id = this.id;
      
      
      const {id, ...rest }= vehicle
       this.providerService.updateVehicle(this.id, rest)
       .subscribe({
        next: () => {
          this.showNotification(
            '¡Éxito!',
            'Vehículo Actualizado con éxito:',
            'success'
          );
          this.router.navigate(['dashboard/list-vehicles']);
        },
        error: (error) => {
          this.handleError(error);
        }
      }); 
    } else {
      // Es agregar
      this.providerService.saveVehicle(vehicle)
  .subscribe({
    next: () => {
      this.showNotification(
        '¡Éxito!',
        'Vehículo Agregado con éxito:',
        'success'
      );
      this.router.navigate(['dashboard/list-vehicles']);
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
