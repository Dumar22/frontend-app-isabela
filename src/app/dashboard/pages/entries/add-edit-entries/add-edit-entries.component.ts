import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorsService } from 'src/app/dashboard/services/Validate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialDetailsComponent } from '../../material-details/material-details.component';
import { Provider } from 'src/app/dashboard/interfaces/providerInterface';
import { ProviderService } from 'src/app/dashboard/services/provider.service';
import { EntriesService } from 'src/app/dashboard/services/entries.service';
import { Entries, Material } from 'src/app/dashboard/interfaces/entriesInterfaces';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
    standalone: true,
    templateUrl: './add-edit-entries.component.html',
    styleUrls: ['./add-edit-entries.component.css'],
    imports: [CommonModule, ReactiveFormsModule, MaterialDetailsComponent]
})
export class AddEditEntriesComponent {

  materials: Material[] = [];
  formEntry: FormGroup;
  id: string ;
  createDetailDto: FormArray;
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
      createDetailDto: this.formBuilder.array([])
        });
        this.id = this.aRouter.snapshot.paramMap.get('id')?? '';
        this.createDetailDto = this.formEntry.get('createDetailDto') as FormArray;
  }

  ngOnInit(): void {
    this.getListProvider()
    if (this.id != '') {
      // Es editar
     this.mode = 'Editar ';
      this.getEntry(this.id);
    }

    
  }

  getListProvider(){
    this.providerService.getProviders()
    .subscribe((data:any) =>{      
      this.provider = data;
      this.provider.sort((a, b) => a.name.localeCompare(b.name));
    });
  }



  isValidField(field: string) {
    return this.validatorsService.isValidField(this.formEntry, field);
  }

  onMaterialsChange(materials: any[]) {
    this.materials = materials;
  }

  onProviderSelect() {
    const selectedProvider = this.provider.find(provider => provider.name === this.formEntry.value.providerName);
    if (selectedProvider) {
      this.formEntry.patchValue({
        providerNit: selectedProvider.nit
      });
    }
  }



 

  getEntry(id: string) {
    this.entryService.getEntryById(id)
    .subscribe((data: Entries) => {
      const formattedDate = new Date(data.date).toISOString().slice(0, 16); 
      const entry = data;
      this.materials = entry.details;
      this.formEntry.patchValue({
        date: formattedDate,
        entryNumber: entry.entryNumber,
        origin: entry.origin,
        providerName: entry.providerName,
        providerNit: entry.providerNit,
       createDetailDto: []
      });
 // Inicializar createDetailDto como un FormArray
 this.createDetailDto = this.formEntry.get('createDetailDto') as FormArray;

      entry.details.forEach((material: any) => {
        this.createDetailDto.push(
          this.formBuilder.group({
            name: [material.name, Validators.required],
            quantity: [material.quantity, [Validators.required, Validators.min(1)]],
            serie: [material.serie],
            observations: [material.observaciones]
          })
        );
      });
    });
  }
    
  addEntry() {
    if (this.formEntry.valid) {
      const newEntry:Entries = {
        date: this.formEntry.value.date,
        entryNumber: this.formEntry.value.entryNumber,
        origin: this.formEntry.value.origin,
        providerName: this.formEntry.value.providerName,
        providerNit: this.formEntry.value.providerNit,
        createDetailDto: this.materials
      };

      if (this.id != '') {
         newEntry.id = this.id;
        //editar
      const { id, ...rest} =  newEntry    
      console.log(rest);
        
        this.entryService.updateEntry(id, rest)
        .subscribe({
          next: () => {
            this.showNotification(
              '¡Éxito!',
              'Entrada Actualizada con éxito:',
              'success'
            );
            this.router.navigate(['dashboard/list-entries']);
          },
          error: (error) => {
            this.handleError(error);
          }
        });

      } else {
        this.entryService.saveEntry(newEntry)
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

 


