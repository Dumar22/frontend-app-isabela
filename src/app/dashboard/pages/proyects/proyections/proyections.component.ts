import { Component, Input, } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DetailsProyectionComponent } from '../details-proyection/details-proyection.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidatorsService } from 'src/app/dashboard/services/Validate.service';
import {  Material } from 'src/app/dashboard/interfaces/entriesInterfaces';
import { ProyectionsService } from 'src/app/dashboard/services/proyections.service';
import { Proyections } from 'src/app/dashboard/interfaces/proyectionsInterfaces';
import { ProyectsService } from 'src/app/dashboard/services/proyects.service';
import { Proyect } from 'src/app/dashboard/interfaces/proyectsInterface';


@Component({
  selector: 'app-proyections',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DetailsProyectionComponent],
  templateUrl: './proyections.component.html',
  styleUrls: ['./proyections.component.css']
})
export class ProyectionsComponent {
  @Input() houses: number = 0;
  @Input() apartments: number = 0;
  materials: Material[] = [];
  formProyection: FormGroup;
  id: string ;
  proyectName: string;
  proyect: any;
  details: FormArray;
  mode: string = 'Agregar '; 
  
  


 
  constructor(
    private formBuilder: FormBuilder,
    private aRouter: ActivatedRoute,
    private router:Router,
    private proyectService: ProyectsService,
    private proyectionService: ProyectionsService,    
     private validatorsService:ValidatorsService) { 
    this.formProyection = this.formBuilder.group({      
      proyectId: [this.id, Validators.required],     
      details: this.formBuilder.array([])
        });
        this.id = this.aRouter.snapshot.paramMap.get('id')?? '';
        this.details = this.formProyection.get('details') as FormArray;
  }

  ngOnInit(): void {
    this.getProyect()
    if (this.id != '') {
      // Es editar
     this.mode = 'Editar ';
      this.getEntry(this.id);
    }

    
  }

  getProyect(){

    this.proyectService.getProyectById(this.id)
    .subscribe((data:any) =>{      
      this.proyectName = data.name;        
      this.proyect = data;
      this.houses = data.house;
      this.apartments = data.apt;
      
    });
  }



  isValidField(field: string) {
    return this.validatorsService.isValidField(this.formProyection, field);
  }

  onMaterialsChange(materials: any[]) {
    this.materials = materials;
  }

  



 

  getEntry(id: string) {
    this.proyectionService.getProyectionById(id)
    
  }
    
  addProyection() {
   
      const newEntry:any = {
        proyectId: this.id,        
        details: this.materials
      };
      console.log(newEntry);  
      
        this.proyectionService.saveProyection(newEntry)
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
