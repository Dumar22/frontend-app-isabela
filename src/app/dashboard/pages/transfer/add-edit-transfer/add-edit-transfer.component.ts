import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from 'src/app/dashboard/services/Validate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProviderService } from 'src/app/dashboard/services/provider.service';
import { Material } from 'src/app/dashboard/interfaces/entriesInterfaces';
import { Provider } from 'src/app/dashboard/interfaces/providerInterface';
import { EntriesService } from 'src/app/dashboard/services/entries.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-edit-transfer.component.html',
  styleUrls: ['./add-edit-transfer.component.css']
})
export class AddEditTransferComponent {

  materials: Material[] = [];
  formEntry: FormGroup;
  id: string ;
  materialEntryDetail: FormArray;
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
      materialEntryDetail: this.formBuilder.array([])
        });
        this.materialEntryDetail = this.formEntry.get('materialEntryDetail') as FormArray;
        this.id = this.aRouter.snapshot.paramMap.get('id')?? '';
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
      this.provider = data.providers;
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
    .subscribe((data: any) => {
      const entry = data.entry;
      this.materials = entry.materialEntryDetail;
      this.formEntry.setValue({
        date: entry.date,
        entryNumber: entry.entryNumber,
        origin: entry.origin,
        providerName: entry.providerName,
        providerNit: entry.providerNit,
        materialEntryDetail: []
      });
      entry.materialEntryDetail.forEach((material: any) => {
        this.materialEntryDetail.push(
          this.formBuilder.group({
            name: [material.name, Validators.required],
            quantity: [material.quantity, [Validators.required, Validators.min(1)]],
            serie: [material.serie],
            observaciones: [material.observaciones]
          })
        );
      });
    });
  }
    
  addEntry() {
    if (this.formEntry.valid) {
      const newEntry = {
        date: this.formEntry.value.date,
        entryNumber: this.formEntry.value.entryNumber,
        origin: this.formEntry.value.origin,
        providerName: this.formEntry.value.providerName,
        providerNit: this.formEntry.value.providerNit,
        materialEntryDetail: this.materials
      };
      this.entryService.saveEntry(newEntry)
      .subscribe({
        next: () => {
          this.showNotification(
            '¡Éxito!',
            'Proveedor Agregado con éxito:',
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
    if (error.status == 0) {
      // Error de conexión
      this.showNotification('¡Error!', 'Hubo un error de conexión con el servidor.', 'error');
    } else if (error.error.errors) {
      // Errores de validación del formulario
      const errores = error.error.errors;
      errores.forEach((error: { msg: any; }) => {
        this.showNotification('¡Error!', error.msg, 'error');
      });
    } else if (error.error.msg === 'El Usuario ya existe, ingrese uno diferente') {
      // Usuario ya existe
      this.showNotification('¡Error!', 'El usuario ya existe en la base de datos. Ingrese uno diferente.', 'error');
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
