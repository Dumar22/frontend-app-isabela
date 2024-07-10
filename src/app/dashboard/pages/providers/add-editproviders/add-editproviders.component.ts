import { ProviderService } from '../../../services/provider.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidatorsService } from 'src/app/dashboard/services/Validate.service';
import { Provider } from 'src/app/dashboard/interfaces/providerInterface';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-add-editproviders',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-editproviders.component.html',
  styleUrls: ['./add-editproviders.component.css']
})
export class AddEditprovidersComponent {


  form: FormGroup;
  id: string ;
  public warehouses : string ;
  operation: string = 'Agregar ';

  constructor(private fb:FormBuilder,
    private router:Router,
    private providerService: ProviderService,
    private authService: AuthService,
    private validatorsService: ValidatorsService,
    private aRouter: ActivatedRoute

    ){
      this.form = this.fb.group({
        name: ['', Validators.required],
        nit: ['', Validators.required],
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

  getProvider(id: string) {
    this.providerService.getProviderById(id)
    .subscribe((data: Provider) => {
      this.form.setValue({
        name: data.name,
        nit: data.nit,
      });
    });
  }

  addProvider() {
   
    const provider: Provider = {
      name: this.form.value.name,
      nit: this.form.value.nit,
    };

    if (this.id !== '') {
      // Es editar
      provider.id = this.id;
      const {id, ...rest } = provider
       this.providerService.updateProvider(id, rest)
       .subscribe({
        next: () => {
          this.showNotification(
            '¡Éxito!',
            'Proveedor Actualizado con éxito:',
            'success'
          );
          this.router.navigate(['dashboard/list-providers']);
        },
        error: (error) => {
          this.handleError(error);
        }
      }); 
    } else {
      // Es agregar
      this.providerService.saveProvider(provider)
  .subscribe({
    next: () => {
      this.showNotification(
        '¡Éxito!',
        'Proveedor Agregado con éxito:',
        'success'
      );
      this.router.navigate(['dashboard/list-providers']);
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
