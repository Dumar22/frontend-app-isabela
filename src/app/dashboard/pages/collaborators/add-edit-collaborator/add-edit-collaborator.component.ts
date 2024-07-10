import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CollaboratorService } from '../../../services/collaborator.service';
import { ValidatorsService } from 'src/app/dashboard/services/Validate.service';
import { Collaborator } from 'src/app/dashboard/interfaces/collaboratorInterface';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ColaboratorOperation } from '../../../interfaces/collaboratorInterface';

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
  public warehouses : string ;
  operation: string = 'Agregar ';
 public colaboratorOperation: any[] = ColaboratorOperation;

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
        mail: ['', Validators.required],
        status: [true, Validators.required],
        
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
       status: data.status,
       mail: data.mail,
       
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
      status: this.form.value.status,
      mail: this.form.value.mail
    };

    if (this.id !== '') {
      // Es editar
      collaborator.id = this.id;
      const {id, ...rest } = collaborator
       this.collaboratorService.updateCollaborator(this.id, rest).subscribe({
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
