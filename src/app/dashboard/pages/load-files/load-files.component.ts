import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiModulesModule } from '../../components/ui-modules/ui-modules.module';
import { MaterialsService } from '../../services/materials.service';
import { MetersService } from '../../services/meters.service';

@Component({
  selector: 'app-load-files',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiModulesModule, ],
  templateUrl: './load-files.component.html',
  styleUrls: ['./load-files.component.css']
})
export class LoadFilesComponent {

  form: FormGroup;
 fileselect: File;
 progress: number = 0;
  loading: boolean = false;

  constructor(private formBuilder: FormBuilder,
     private loadMaterials: MaterialsService,
     private loadMeters : MetersService) {
    this.form = this.formBuilder.group({
      file: ['', Validators.required],
      type: ['', Validators.required]
    });
  }

  onSelectedFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fileselect = input.files.item(0);
  }

  onTipoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.form.get('type').setValue(input.value);
  }

  send(): void {
    //console.log(this.form.value);
    

    if (this.form.invalid) {
      return;
    }
  
    this.loading = true;
    this.progress = 0; // Reinicializamos el progreso
  
    const archivo = this.fileselect;
    const tipo = this.form.get('type').value;
  
    switch (tipo) {
      case 'materials':
        this.progress = 0; // Reinicializamos el progreso
        const progressInterval = setInterval(() => {
          this.handleProgressAndSuccess(progressInterval);
        }, 3000);

        this.loadMaterials.loadMaterials(archivo).subscribe({
          next: progress => {
            this.progress = progress;
            if (progress === 100) {
              clearInterval(progressInterval);
              this.loading = false;
              this.progress = 0; // Reinicializamos el progreso
              this.showNotification('¡Éxito!', 'Archivo cargado exitosamente.', 'success');
            }
          },
          error: error => {
            clearInterval(progressInterval);
            this.loading = false;
            this.progress = 0; // Reinicializamos el progreso
            this.handleError(error); // Handle errors
          }
        });
        console.log('mat',archivo);
        break;
  
      case 'meters':
        this.progress = 0; // Reinicializamos el progreso
      const progressIntervalM = setInterval(() => {
        this.handleProgressAndSuccess(progressIntervalM);
      }, 3000);

        this.loadMeters.loadMeters(archivo).subscribe({
          
          next: progress => {
            this.progress = progress;
            if (progress === 100) {
              clearInterval(progressIntervalM);
              this.loading = false;
              this.progress = 0; // Reinicializamos el progreso
              // Archivo cargado exitosamente
              this.showNotification('¡Éxito!', 'Archivo cargado exitosamente.', 'success');

            }
          }, error: error => {
            clearInterval(progressIntervalM);
            this.loading = false;
            this.progress = 0; // Reinicializamos el progreso
            this.showNotification('¡Error!', 'Hubo un error al cargar el archivo.', 'error');
          }          
        }
          
        );
        console.log('medi',archivo);
        break;
  
      default:
        this.loading = false;
        this.progress = 0; // Reinicializamos el progreso
        // Tipo de archivo no válido
        break;
    }
  }
  
  handleProgressAndSuccess(progressInterval: any): void {
    this.progress += 25; // Incrementa el progreso gradualmente
  
    if (this.progress >= 100) {
      clearInterval(progressInterval); // Detiene el temporizador
      this.loading = false;
      this.progress = 0; // Reinicializamos el progreso
      this.showNotification('¡Éxito!', 'Archivo cargado exitosamente.', 'success');
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
