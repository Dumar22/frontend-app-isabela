import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CollaboratorService } from '../../../services/list-collaborator.service';
import { ValidatorsService } from 'src/app/dashboard/services/Validate.service';
import { Collaborator } from 'src/app/dashboard/interfaces/collaboratorInterface';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'add-edit-collaborator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-edit-collaborator.component.html',
  styleUrls: ['./add-edit-collaborator.component.css']
})
export class AddEditCollaboratorComponent {

  form: FormGroup;
  id: string ;
  public warehouse : string ;
  operation: string = 'Agregar ';

  constructor(private fb:FormBuilder,
    private router:Router,
    private authService: AuthService,
    private collaboratorService: CollaboratorService,
    private validatorsService: ValidatorsService,
    private aRouter: ActivatedRoute

    ){
      this.form = this.fb.group({
        name: ['', Validators.required],
        code: ['', Validators.required],
        operation: ['', Validators.required],
        document: ['', Validators.required],
        phone: ['', Validators.required],
        state: ['', Validators.required],
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
      this.getCollaborator(this.id);
    }
  }

  getCollaborator(id: string) {
    this.collaboratorService.getCollaboratorById(id)
    .subscribe((data: Collaborator) => {
      this.form.setValue({
        name: data.name,
        code: data.code,
        operation: data.operation,
        document: data.document,
        phone: data.phone,
       state: data.state,
       warehouse: this.warehouse
      });
    });
  }

  addCollaborator() {
   

    const collaborator: Collaborator = {
      name: this.form.value.name,
      code: this.form.value.code,
      operation: this.form.value.operation,
      document: this.form.value.document,
      phone: this.form.value.phone,
      state: this.form.value.state,
      warehouse: this.warehouse
    };

    if (this.id !== '') {
      // Es editar
      collaborator.id = this.id;
       this.collaboratorService.updateCollaborator(this.id, collaborator).subscribe({
        next: () => {
          this.showNotification(
            '¡Éxito!',
            'Movil Actualizado con éxito:',
            'success'
          );
        this.router.navigate(['dashboard/list-collaborators']);
      },
      error: (error) => {
        this.handleError(error);
      }
    });
    } else {
      // Es agregagar
      this.collaboratorService.saveCollaborator(collaborator)
      .subscribe({
        next: () => {
          this.showNotification(
            '¡Éxito!',
            'Movil Agregado con éxito:',
            'success'
          );
        this.router.navigate(['dashboard/list-collaborators']);
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
