import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UiModulesModule } from 'src/app/dashboard/components/ui-modules/ui-modules.module';
import { Proyect } from 'src/app/dashboard/interfaces/proyectsInterface';
import { ValidatorsService } from 'src/app/dashboard/services/Validate.service';
import { ProyectsService } from 'src/app/dashboard/services/proyects.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-add-edit-proyect',
  standalone: true,
  imports: [
    CommonModule, UiModulesModule, ReactiveFormsModule
  ],
  template: `
 <div class="container d-flex justify-content-center">


<div class="col-md-6">
  <form [formGroup]="form" (ngSubmit)="addProyect()">
    <div class="justify-content-center text-center mb-4">

      <h2 >{{ operation }} Proyecto </h2>
    </div>
    <div class="form-group mb-2">
      <label for="name">Nombre</label>
      <input type="text" id="name" class="form-control" formControlName="name">
    </div>
    <div class="form-group mb-2">
        <label for="initialize"> Inicialización </label>
        <input type="datetime-local" id="initialize" class="form-control" formControlName="initialize">
      </div> 

    <div class="col-md-12 mb-3">
        <label class="form-label">Observación: </label>
       <textarea id="obs" formControlName="obs" class="form-control"></textarea>
      </div>

    <button type="submit" class="btn btn-primary ">{{ operation }} Proveedor</button>
  </form>
</div>
</div>
  
  `,
  styleUrls: ['./addEditProyect.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEditProyectComponent {
  
  form: FormGroup;
  id: string ;
  public warehouses : string ;
  operation: string = 'Agregar ';

  constructor(private fb:FormBuilder,
    private router:Router,
    private proyectService: ProyectsService,
    private authService: AuthService,
    private validatorsService: ValidatorsService,
    private aRouter: ActivatedRoute

    ){
      this.form = this.fb.group({
        name: ['', Validators.required],
        initialize: ['', Validators.required],
        obs: ['',],
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
      this.getProvider(this.id);
    }
  }
//
  getProvider(id: string) {
    this.proyectService.getProyectById(id)
    .subscribe((data: Proyect) => {
      const formattedDate = new Date(data.initialize).toISOString().slice(0, 16); // Formatear la fecha y hora

      this.form.setValue({
        name: data.name,
        initialize: formattedDate,
        obs: data.obs,
      });
    });
  }

  addProyect() {
   
    const proyect: Proyect = {
      name: this.form.value.name,
      initialize: this.form.value.initialize,
      obs: this.form.value.obs,
    };

    if (this.id !== '') {
      // Es editar
      proyect.id = this.id;
      const {id, ...rest } = proyect
       this.proyectService.updateProyect(id, rest)
       .subscribe({
        next: () => {
          this.showNotification(
            '¡Éxito!',
            'Proyecto Actualizado con éxito:',
            'success'
          );
          this.router.navigate(['dashboard/list-proyect']);
        },
        error: (error) => {
          this.handleError(error);
        }
      }); 
    } else {
      // Es agregar
      this.proyectService.saveProyect(proyect)
  .subscribe({
    next: () => {
      this.showNotification(
        '¡Éxito!',
        'Proyecto Agregado con éxito:',
        'success'
      );
      this.router.navigate(['dashboard/list-proyect']);
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

