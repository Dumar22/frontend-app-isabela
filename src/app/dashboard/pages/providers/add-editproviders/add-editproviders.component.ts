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
  public warehouse : string ;
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
        ally: ['', Validators.required],
        warehouse: [this.warehouse, Validators.required]
      });
      this.id = this.aRouter.snapshot.paramMap.get('id')?? '';
  }

  isValidField(field: string) {
    return this.validatorsService.isValidField(this.form, field);
  }

  ngOnInit(): void {

    const user = this.authService.currentUser
    this.warehouse = user().warehouse;

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
        ally: data.ally,
        warehouse: this.warehouse
      });
    });
  }

  addProvider() {
   
    const provider: Provider = {
      name: this.form.value.name,
      nit: this.form.value.nit,
      ally: this.form.value.ally,
     warehouse: this.warehouse
    };

    if (this.id !== '') {
      // Es editar
      provider.id = this.id;
       this.providerService.updateProvider(this.id, provider)
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
      // Es agregagar
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
