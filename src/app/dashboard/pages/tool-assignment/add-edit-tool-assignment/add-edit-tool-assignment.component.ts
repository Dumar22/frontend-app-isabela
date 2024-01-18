import { CommonModule } from '@angular/common';
import {  Component } from '@angular/core';
import {  FormBuilder,  ReactiveFormsModule, Validators } from '@angular/forms';
import {  Tool, ToolAssignment} from 'src/app/dashboard/interfaces/tool-assignmentInterface';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolAssignmentService } from 'src/app/dashboard/services/toolAssignment.service';
import { ValidatorsService } from 'src/app/dashboard/services/Validate.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { AddEditDetailsToolAssignmentComponent } from "../add-edit-details-tool-assignment/add-edit-details-tool-assignment.component";
import { ToolsService } from 'src/app/dashboard/services/tools.service';

@Component({
    selector: 'app-add-edit-tool-assignment',
    standalone: true,
    templateUrl: './add-edit-tool-assignment.component.html',
    styleUrls: ['./add-edit-tool-assignment.component.css'],
    imports: [
        CommonModule, ReactiveFormsModule,
        AddEditDetailsToolAssignmentComponent
    ]
})
export class AddEditToolAssignmentComponent { 

 
  tool:Tool[] = [];
  id: string ;
  mode: string = 'Agregar '; 

  types = [
    {value: 'Nueva entrga', name: 'Nueva entrga' },
    {value: 'Entrega por desgaste', name: 'Entrega por desgaste' },
    {value: 'Entrega por perdida', name: 'Entrega por perdida' },
    {value: 'Entrega controlada', name: 'Entrega controlada' },
  ]

   public toolAssignmentForm = this.formBuilder.group({
   
    assignedAt: ['', Validators.required],    
    reason: ['', Validators.required],
    collaboratorId: ['', ],    
    toolId: ['', Validators.required],    
    assignedQuantity: [0, Validators.required],    
    observation: [''],    
      });

    
  constructor(
    private formBuilder: FormBuilder,
    private aRouter: ActivatedRoute,
    private router:Router,
    private toolService: ToolsService,
    private toolAssignmentService:ToolAssignmentService,
     private validatorsService:ValidatorsService) { 
        this.id = this.aRouter.snapshot.paramMap.get('id')?? '';
  }

  ngOnInit(): void {
    this.getListTools();    
  }

  getListTools(){
    this.toolService.getTools()
    .subscribe((data:Tool[]) =>{       
      this.tool = data;      
  });
  }

  isValidField(field: string) {
    return this.validatorsService.isValidField(this.toolAssignmentForm, field);
  }
    
   addtoolAssignment() {     
        
    if (this.toolAssignmentForm.valid) {
      const newToolAssignment: ToolAssignment = {
        reason:this.toolAssignmentForm.value.reason,
        collaboratorId:this.id,
        toolId:this.toolAssignmentForm.value.toolId,
        assignedQuantity:this.toolAssignmentForm.value.assignedQuantity,
        observation:this.toolAssignmentForm.value.observation,
        assignedAt:this.toolAssignmentForm.value.assignedAt,
      };

        this.toolAssignmentService.saveToolAssignment(newToolAssignment)
      .subscribe({
        next: () => {
          this.showNotification(
            '¡Éxito!',
            'Assignación de herramienta Agregado con éxito:',
            'success'
          );
          this.router.navigate(['dashboard/details-tools-assignment', this.id]);
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
