import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiModulesModule } from 'src/app/dashboard/components/ui-modules/ui-modules.module';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ToolsService } from 'src/app/dashboard/services/tools.service';
import { Tools } from 'src/app/dashboard/interfaces/toolsInterface';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiModulesModule],
  templateUrl: './add-edit-tools.component.html',
  styleUrls: ['./add-edit-tools.component.css']
})
export class AddEditToolsComponent implements OnInit {

  form: FormGroup;
  id: string ;
  public warehouses : string ;
  operation: string = 'Agregar ';

  typeUnities = [
    { id: 'UNIDAD', value: 'UNIDAD' },
    { id: 'METRO', value: 'METRO' },
    { id: 'METRO 3(m3)', value: 'METRO 3(m3)' },
    { id: 'KILOGRAMO', value: 'KILOGRAMO' },
    { id: 'LITRO', value: 'LITRO' }
  ];

  options = [
    { id: 'disponible', value: true, label: 'Disponible' },
    { id: 'no-disponible', value: false, label: 'No disponible' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toolService: ToolsService,    
    private aRouter: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      unity: ['', Validators.required],      
      quantity: ['', Validators.required],
      price: ['', Validators.required],    
      available: [false],
    });
    this.id = this.aRouter.snapshot.paramMap.get('id')?? '';
    this.form.get('quantity').valueChanges.subscribe((value) => {
      if (value >= 1) {
        this.form.get('available').setValue(true);
      } else{
        this.form.get('available').setValue(false);
      }
    });  
  }

  nonNegativeValidator(control: AbstractControl): {[key: string]: any} | null {
    const value = control.value;
    if (value != null && value < 0) {
      return {'nonNegative': true};
    }
    return null;
  }

  ngOnInit(): void {
    const user = this.authService.currentUser
    this.warehouses = user().warehouses[0];

    if (this.id != '') {
      // Es editar
     this.operation = 'Editar ';
      this.getTool(this.id);
    }
  }

  getTool(id: string) {
    this.toolService.getToolById(id)
    .subscribe((data: Tools) => {
      this.form.setValue({
        name: data.name,
        code: data.code,
        unity: data.unity,        
        quantity: data.quantity,
        price: data.price,       
        available: data.available,       
      });
    });
  }

  addTool() {
    
    const tool: Tools = {
      name: this.form.value.name,
      code: this.form.value.code,
      unity: this.form.value.unity,     
      quantity: this.form.value.quantity,
      price: this.form.value.price, 
      available: this.form.value.available,
    };

    if (this.id !== '') {
      // Es editar
      tool.id = this.id;
      const {id, ...rest } = tool
      this.toolService.updateTool(id, rest)
      .subscribe({
        next: () => {
          this.showNotification(
            '¡Éxito!',
            'Herramienta Actualizada con éxito:',
            'success'
          );
        this.router.navigate(['dashboard/list-tools']);
      },
      error: (error) => {
        this.handleError(error);
      }
    });
    } else {
      // Es agregagar
      this.toolService.saveTool(tool)
      .subscribe({
        next: () => {
          this.showNotification(
            '¡Éxito!',
            'Herramienta agregada con éxito:',
            'success'
          );
        this.router.navigate(['dashboard/list-tools']);
      },
      error: (error) => {
        this.handleError(error);
      }
    });
    }
  }

  handleError(error: any) {    
     console.log(error);

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
