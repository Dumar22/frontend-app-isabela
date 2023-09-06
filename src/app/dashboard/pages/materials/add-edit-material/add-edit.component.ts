import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MaterialsService } from '../../../services/materials.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Material } from 'src/app/dashboard/interfaces/materialsInterface';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { UiModulesModule } from 'src/app/dashboard/components/ui-modules/ui-modules.module';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'add-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiModulesModule],
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css'],
})
export class AddEditComponent implements OnInit {
  form: FormGroup;
  id: string ;
  public warehouse : string ;
  operation: string = 'Agregar ';

  options = [
    { id: 'disponible', value: true, label: 'Disponible' },
    { id: 'no-disponible', value: false, label: 'No disponible' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private materialService: MaterialsService,    
    private aRouter: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      unity: ['', Validators.required],      
      quantity: ['', Validators.required],
      value: ['', Validators.required],     
      warehouse: [this.warehouse],
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
    this.warehouse = user().warehouse;

    if (this.id != '') {
      // Es editar
     this.operation = 'Editar ';
      this.getMaterial(this.id);
    }
  }

  getMaterial(id: string) {
    this.materialService.getMatrialById(id)
    .subscribe((data: Material) => {
      this.form.setValue({
        name: data.name,
        code: data.code,
        unity: data.unity,        
        quantity: data.quantity,
        value: data.value,
        warehouse: this.warehouse,
        available: data.available,        
      });
    });
  }

  addMaterial() {
    
    const material: Material = {
      name: this.form.value.name,
      code: this.form.value.code,
      unity: this.form.value.unity,     
      quantity: this.form.value.quantity,
      value: this.form.value.value,      
      warehouse: this.warehouse,
      available: this.form.value.available,
    };

    if (this.id !== '') {
      // Es editar
      material.id = this.id;
      this.materialService.updateMaterial(this.id, material)
      .subscribe({
        next: () => {
          this.showNotification(
            '¡Éxito!',
            'Material Actualizado con éxito:',
            'success'
          );
        this.router.navigate(['dashboard/list-materials']);
      },
      error: (error) => {
        this.handleError(error);
      }
    });
    } else {
      // Es agregagar
      this.materialService.saveMaterial(material)
      .subscribe({
        next: () => {
          this.showNotification(
            '¡Éxito!',
            'Material Agregado con éxito:',
            'success'
          );
        this.router.navigate(['dashboard/list-materials']);
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
    } else if (error.error.msg === 'El Material ya existe, ingrese uno diferente') {
      // Usuario ya existe
      this.showNotification('¡Error!', 'El Material ya existe en la base de datos. Ingrese uno diferente.', 'error');
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
