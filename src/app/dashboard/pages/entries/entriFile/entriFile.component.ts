import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Entries } from 'src/app/dashboard/interfaces/entriesInterfaces';
import { ValidatorsService } from 'src/app/dashboard/services/Validate.service';
import { Provider } from 'src/app/dashboard/interfaces/providerInterface';
import { EntriesService } from 'src/app/dashboard/services/entries.service';
import { ProviderService } from 'src/app/dashboard/services/provider.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-entri-file',
  standalone: true,
  imports: [
    CommonModule,ReactiveFormsModule,
  ],
  template: `
  

<div class="container">
<h3 class="text-center mb-5">Agregar nueva entrada</h3>

<form class="row" (ngSubmit)="addEntry()" autocomplete="off" [formGroup]="formEntry">
  <div class="col-md-4 mb-3">
    <label class="form-label">Fecha</label>
    <input type="datetime-local" class="form-control" formControlName="date" />
    <!-- <div *ngIf="isValidField('date')" class="form-text text-danger">La fecha es requerida</div> -->
  </div>
  <div class="col-md-4 mb-3">
    <label class="form-label">Entrada N°</label>
    <input type="text" class="form-control" formControlName="entryNumber" placeholder="0" />
    <!-- <div *ngIf="isValidField('id_add')" class="form-text text-danger">El campo es requerido</div> -->
  </div>
  <div class="col-md-4 mb-3">
    <label class="form-label">Origen</label>
    <input type="text" class="form-control" formControlName="origin" placeholder="Ciudad origen" />
    <!-- <div *ngIf="isValidField('invoiceorigin')" class="form-text text-danger">El campo es requerido</div> -->
  </div>
  <div class="col-md-6 mb-3">
    <label class="form-label">Proveedor</label>
    <select class="form-select" aria-label="Default select example" formControlName="providerName" (change)="onProviderSelect()">
      <option selected>--Seleccione--</option>
      <option *ngFor="let provider of provider">{{ provider.name }}</option>
    </select>
  </div>
  <div class="col-md-6 mb-3">
    <label class="form-label">Nit</label>
    <input type="number" class="form-control" formControlName="providerNit" placeholder="" />
  </div>
  <div class="col-md-6 mb-3">
    <label class="form-label">Archivo Excel</label>
    <input type="file" class="form-control" formControlName="file" (change)="onSelectedFile($event)"/>
  </div>

 

  <hr />

  <div class="col-12">
    <button type="submit" class="btn btn-primary">Guardar Entrada</button>
  </div>

</form>

</div>


  `,
  styles: [`
    :host {
      display: block;
    }
  `],
})
export class EntriFileComponent { 


  formEntry: FormGroup;
  fileselect: File;
  id: string ; 
  mode: string = 'Agregar '; 
  public provider: Provider[];

  constructor(
    private formBuilder: FormBuilder,
    private aRouter: ActivatedRoute,
    private router:Router,
    private providerService: ProviderService,
    private entryService:EntriesService,
     private validatorsService:ValidatorsService) { 
    this.formEntry = this.formBuilder.group({
      date: ['', Validators.required],
      entryNumber: ['', Validators.required],
      origin: ['', Validators.required],
      providerName: ['', Validators.required],
      providerNit: ['', Validators.required],
      file: ['', Validators.required],
        });
        this.id = this.aRouter.snapshot.paramMap.get('id')?? '';
       
  }

  ngOnInit(): void {
    this.getListProvider()
   
  }

  getListProvider(){
    this.providerService.getProviders()
    .subscribe((data:any) =>{      
      this.provider = data;
  });
  }

  onProviderSelect() {
    const selectedProvider = this.provider.find(provider => provider.name === this.formEntry.value.providerName);
    if (selectedProvider) {
      this.formEntry.patchValue({
        providerNit: selectedProvider.nit
      });
    }
  }

  onSelectedFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
        this.fileselect = input.files.item(0);
    } else {
        // Manejar el caso en que no se selecciona ningún archivo
        this.fileselect = null;
    }
}

  addEntry() {

    const archivo = this.fileselect;
    if (this.formEntry.valid) {
      const newEntry:Entries = {
        date: this.formEntry.value.date,
        entryNumber: this.formEntry.value.entryNumber,
        origin: this.formEntry.value.origin,
        providerName: this.formEntry.value.providerName,
        providerNit: this.formEntry.value.providerNit,
        
      };

   
        this.entryService.saveEntryFile(newEntry, archivo)
      .subscribe({
        next: () => {
          this.showNotification(
            '¡Éxito!',
            'Entrada Agregada con éxito:',
            'success'
          );
          this.router.navigate(['dashboard/list-entries']);
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
