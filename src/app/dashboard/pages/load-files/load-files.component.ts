import { WorkRegisterService } from 'src/app/dashboard/services/work-install.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiModulesModule } from '../../components/ui-modules/ui-modules.module';
import { MaterialsService } from '../../services/materials.service';
import { MetersService } from '../../services/meters.service';
import { CollaboratorService } from '../../services/collaborator.service';
import { ProviderService } from '../../services/provider.service';
import { ToolsService } from '../../services/tools.service';

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
     private loadCollaborators: CollaboratorService,
     private loadMeters : MetersService,
     private loadTools : ToolsService,
     private loadProviders: ProviderService,
     private loadRegsitartion: WorkRegisterService) {
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
        const progressTimeout = setTimeout(() => {
          this.handleProgressAndSuccess(progressTimeout);
        }, 3);

        this.loadMaterials.loadMaterials(archivo).subscribe({
          next: progress => {
            this.progress = progress;
            if (progress === 100) {
              this.showNotification('¡Éxito!', 'Archivo cargado exitosamente.', 'success');
              clearTimeout(progressTimeout);
              this.loading = false;
              this.progress = 0; // Reinicializamos el progreso
            }
          },
          error: error => {
            clearTimeout(progressTimeout);
            this.loading = false;
            this.progress = 50; // Reinicializamos el progreso
            this.handleError(error); // Handle errors
          }
        });
        // console.log('mat',archivo);
        break;

      case 'tools':
        this.progress = 0; // Reinicializamos el progreso
        const progressTimeoutT = setTimeout(() => {
          this.handleProgressAndSuccess(progressTimeout);
        }, 3);

        this.loadTools.loadTools(archivo).subscribe({
          next: progress => {
            this.progress = progress;
            if (progress === 100) {
              this.showNotification('¡Éxito!', 'Archivo cargado exitosamente.', 'success');
              clearTimeout(progressTimeoutT);
              this.loading = false;
              this.progress = 0; // Reinicializamos el progreso
            }
          },
          error: error => {
            clearTimeout(progressTimeoutT);
            this.loading = false;
            this.progress = 50; // Reinicializamos el progreso
            this.handleError(error); // Handle errors
          }
        });
        // console.log('mat',archivo);
        break;
  
      case 'meters':
        this.progress = 0; // Reinicializamos el progreso
        const progressTimeoutm = setTimeout(() => {
          this.handleProgressAndSuccess(progressTimeout);
        }, 5);

        this.loadMeters.loadMeters(archivo).subscribe({
          
          next: progress => {
            this.progress = progress;
            if (progress === 100) {
              clearTimeout(progressTimeoutm);
              this.loading = false;
              this.progress = 0; // Reinicializamos el progreso
              // Archivo cargado exitosamente
              this.showNotification('¡Éxito!', 'Archivo cargado exitosamente.', 'success');

            }
          }, error: error => {
            clearTimeout(progressTimeoutm);
            this.loading = false;
            this.progress = 0; // Reinicializamos el progreso
            this.showNotification('¡Error!', 'Hubo un error al cargar el archivo.', 'error');
          }          
        }
          
        );
        // console.log('medi',archivo);
        break;
  
        case 'collaborators':
        this.progress = 0; // Reinicializamos el progreso
        const progressTimeoutc = setTimeout(() => {
          this.handleProgressAndSuccess(progressTimeout);
        }, 3);

        this.loadCollaborators.loadingCollaborators(archivo).subscribe({
          next: progress => {
            this.progress = progress;
            if (progress === 100) {
              this.showNotification('¡Éxito!', 'Archivo cargado exitosamente.', 'success');
              clearTimeout(progressTimeoutc);
              this.loading = false;
              this.progress = 0; // Reinicializamos el progreso
            }
          },
          error: error => {
            clearTimeout(progressTimeoutc);
            this.loading = false;
            this.progress = 50; // Reinicializamos el progreso
            this.handleError(error); // Handle errors
          }
        });
        // console.log('mat',archivo);
        break;
  

        case 'providers':
          this.progress = 0; // Reinicializamos el progreso
          const progressTimeoutp = setTimeout(() => {
            this.handleProgressAndSuccess(progressTimeout);
          }, 3);
  
          this.loadProviders.loadingProviders(archivo).subscribe({
            next: progress => {
              this.progress = progress;
              if (progress === 100) {
                this.showNotification('¡Éxito!', 'Archivo cargado exitosamente.', 'success');
                clearTimeout(progressTimeoutp);
                this.loading = false;
                this.progress = 0; // Reinicializamos el progreso
              }
            },
            error: error => {
              clearTimeout(progressTimeoutp);
              this.loading = false;
              this.progress = 50; // Reinicializamos el progreso
              this.handleError(error); // Handle errors
            }
          });
          // console.log('mat',archivo);
          break;

        case 'matriculas':
          this.progress = 0; // Reinicializamos el progreso
          const progressTimeoutma = setTimeout(() => {
            this.handleProgressAndSuccess(progressTimeout);
          }, 3);
  
          this.loadRegsitartion.loadWorkRegister(archivo).subscribe({
            next: progress => {
              this.progress = progress;
              if (progress === 100) {
                this.showNotification('¡Éxito!', 'Archivo cargado exitosamente.', 'success');
                clearTimeout(progressTimeoutma);
                this.loading = false;
                this.progress = 0; // Reinicializamos el progreso
              }
            },
            error: error => {
              clearTimeout(progressTimeoutma);
              this.loading = false;
              this.progress = 50; // Reinicializamos el progreso
              this.handleError(error); // Handle errors
            }
          });
          // console.log('mat',archivo);
          break;
    
      default:
        this.loading = false;
        this.progress = 0; // Reinicializamos el progreso
        // Tipo de archivo no válido
        break;
    }
  }
  
  handleProgressAndSuccess(progressTimeout: any): void {
    this.progress += 3; // Incrementa el progreso gradualmente

    if (this.progress >= 100) {
      clearTimeout(progressTimeout); // Detiene el temporizador
      this.loading = false;
      this.progress = 0; // Reinicializamos el progreso
      this.showNotification('¡Éxito!', 'Archivo cargado exitosamente.', 'success');
    } else {
      const nextTimeout = setTimeout(() => {
        this.handleProgressAndSuccess(progressTimeout);
      }, 3);
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
