import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UiModulesModule } from 'src/app/dashboard/components/ui-modules/ui-modules.module';
import { Collaborator } from 'src/app/dashboard/interfaces/collaboratorInterface';
import { Proyect } from 'src/app/dashboard/interfaces/proyectsInterface';
import { ValidatorsService } from 'src/app/dashboard/services/Validate.service';
import { CollaboratorService } from 'src/app/dashboard/services/collaborator.service';
import { ProyectsService } from 'src/app/dashboard/services/proyects.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-add-edit-proyect',
  standalone: true,
  imports: [
    CommonModule, UiModulesModule, ReactiveFormsModule,
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

      <div class="form-group mb-2">
        <label for="municipality"> Municipio </label>
        <input type="text" id="municipality" class="form-control" formControlName="municipality">
      </div>

      <div class="form-group mb-2">
      <label for="address"> Dirección </label>
      <input type="text" id="address" class="form-control" formControlName="address">
    </div>

    <div class="form-group mb-3">
        <label class="form-label">Instaldor</label>
        <select class="form-select" aria-label="Default select example" formControlName="install">
          <option selected>--Seleccione--</option>
          <option *ngFor="let collaborator of collaborator" [value]="collaborator.name">{{ collaborator.code }} - {{ collaborator.name}}</option>
        </select>
      </div>

      <div class="form-group mb-3">
        <label class="form-label">Ayudante</label>
        <select class="form-select" aria-label="Default select example" formControlName="install2">
          <option selected>--Seleccione--</option>
          <option *ngFor="let collaborator of collaborator" [value]="collaborator.name">{{ collaborator.code }} - {{ collaborator.name}}</option>
        </select>
      </div>

      <div class="form-group mb-3">
      <label class="form-label">Tipo de asignación</label>
      <select class="form-select" aria-label="Default select example" formControlName="type" >
        <option selected>--Seleccione--</option>
        <option *ngFor="let type of typeAssinment">{{ type.name }}</option>
      </select>
    </div>

    <div class="form-group mb-2">
    <label for="house"> Casa </label>
    <input type="number" id="house" class="form-control" formControlName="house">
  </div>

  <div class="form-group mb-2">
  <label for="apt"> Apto </label>
  <input type="number" id="apt" class="form-control" formControlName="apt">
</div>

<div class="form-group mb-2">
  <label for="tower"> Torre </label>
  <input type="text" id="tower" class="form-control" formControlName="tower">
</div>

<div class="form-group mb-2">
  <label for="floor"> Piso </label>
  <input type="number" id="floor" class="form-control" formControlName="floor">
</div>

<div class="col-md-12 mb-3">
<label class="form-label">Modificaciones: </label>
<textarea id="modifications" formControlName="modifications" class="form-control"></textarea>
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
  
})
export class AddEditProyectComponent {


  typeAssinment = [
    { name: '1 pto'},
    { name: 'Completo'},
    { name: '2 Ptos'},
    { name: 'Otro'},
  ]

  form: FormGroup;
  id: string;
  public warehouses: string;
  collaborator: Collaborator[];
  operation: string = 'Agregar ';

  constructor(private fb: FormBuilder,
    private router: Router,
    private proyectService: ProyectsService,
    private collaboratorService: CollaboratorService,
    private authService: AuthService,
    private validatorsService: ValidatorsService,
    private aRouter: ActivatedRoute

  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      initialize: ['', Validators.required],
      municipality: ['', Validators.required],
      address: ['', Validators.required],
      install: ['', Validators.required],
      install2: ['',],
      type: ['', Validators.required],
      house: [''],
      apt: [''],
      tower: [''],
      floor: [''],
      modifications: [''],
      obs: ['',],
    });
    this.id = this.aRouter.snapshot.paramMap.get('id') ?? '';
  }

  isValidField(field: string) {
    return this.validatorsService.isValidField(this.form, field);
  }

  ngOnInit(): void {
    this.getListCollaborator()

    const user = this.authService.currentUser
    this.warehouses = user().warehouses[0];

    if (this.id != '') {
      // Es editar
      this.operation = 'Editar ';
      this.getProvider(this.id);
    }
  }

  getListCollaborator(){
    this.collaboratorService.getCollaborators()
    .subscribe((data:any) =>{      
      this.collaborator = data.filter(collaborator => collaborator.status === true);
      this.collaborator.sort((a, b) => a.name.localeCompare(b.name));  
      
      
      
  });
  }
  //
  getProvider(id: string) {
    this.proyectService.getProyectById(id)
      .subscribe((data: Proyect) => {
        const formattedDate = new Date(data.initialize).toISOString().slice(0, 16); // Formatear la fecha y hora

        this.form.setValue({
          name: data.name,
          initialize: formattedDate,
          municipality: data.municipality,
          address: data.address,
          install: data.install,
          install2: data.install2,
          type: data.type,
          house: data.house,
          apt: data.apt,
          tower: data.tower,
          floor: data.floor,  
          modifications: data.modifications,
          obs: data.obs,
        });
      });
  }

  addProyect() {

    const proyect: Proyect = {
      name: this.form.value.name,
      initialize: this.form.value.initialize,
      municipality: this.form.value.municipality,
          address: this.form.value.address,
          install: this.form.value.install,
          install2: this.form.value.install2,
          type: this.form.value.type,
          house: this.form.value.house,
          apt: this.form.value.apt,
          tower: this.form.value.tower,
          floor: this.form.value.floor,  
          modifications: this.form.value.modifications,
          obs: this.form.value.obs,
    };

    if (this.id !== '') {
      // Es editar
      proyect.id = this.id;
      const { id, ...rest } = proyect
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

