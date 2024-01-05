import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToolAssignment, Tool, Detail, Collaborator} from 'src/app/dashboard/interfaces/tool-assignmentInterface';
import { ActivatedRoute, Router } from '@angular/router';
import { CollaboratorService } from 'src/app/dashboard/services/collaborator.service';
import { ToolAssignmentService } from 'src/app/dashboard/services/toolAssignment.service';
import { ValidatorsService } from 'src/app/dashboard/services/Validate.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { AddEditDetailsToolAssignmentComponent } from "../add-edit-details-tool-assignment/add-edit-details-tool-assignment.component";

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

  tools:Detail[] = [];
  toolNames: []
  id: string ;
  details: FormArray;
  mode: string = 'Agregar '; 
  public collaborator: Collaborator[];

  types = [
    {value: 'nueva entrga', name: 'Nueva entrga' },
    {value: 'entrega por desgaste', name: 'Entrega por desgaste' },
    {value: 'entrega por perdida', name: 'Entrega por perdida' },
    {value: 'entrega controlada', name: 'Entrega controlada' },
  ]

   public toolAssignmentForm = this.formBuilder.group({
    date: ['', Validators.required],
    reason: ['', Validators.required],
    observation: ['', Validators.required],
    collaboratorId: ['', Validators.required],    
    details: this.formBuilder.array([])
      });

    
  constructor(
    private formBuilder: FormBuilder,
    private aRouter: ActivatedRoute,
    private router:Router,
    private collaboratorService: CollaboratorService,
    private toolAssignmentService:ToolAssignmentService,
     private validatorsService:ValidatorsService) { 
      this.details = this.toolAssignmentForm.get('details') as FormArray;
        this.id = this.aRouter.snapshot.paramMap.get('id')?? '';
  }

  ngOnInit(): void {
    this.getListCollaborator()
    if (this.id != '') {
      // Es editar
     this.mode = 'Editar ';
     this.getToolAssignment()
    
    }
  }

  getListCollaborator(){
    this.collaboratorService.getCollaborators()
    .subscribe((data:any) =>{      
      this.collaborator = data;
      
  });
  }

  isValidField(field: string) {
    return this.validatorsService.isValidField(this.toolAssignmentForm, field);
  }

  onToolsChange(tools: Detail[]) {
    this.tools = tools;
  }


  getToolAssignment() {
    this.toolAssignmentService.getToolAssignmentById(this.id)
    .subscribe((data: ToolAssignment) => {
      const toolAssignment = data;
      // console.log(toolAssignment);     
       this.tools = toolAssignment.details;
      
      this.toolAssignmentForm.patchValue({
        date: toolAssignment.date,
        reason: toolAssignment.reason,
        observation: toolAssignment.observation,
        collaboratorId: toolAssignment.collaborator.id,
        
        
      });
      toolAssignment.details.forEach((tool: Detail) => {                
        this.details.push(
          this.formBuilder.group({
            toolId: [tool.tool.id, Validators.required],
            assignedAt: [tool.assignedAt],
            assignedQuantity: [tool.assignedQuantity, [Validators.required, Validators.min(1)]],
            observation: [tool.observation],
            durabilityTool: [tool.durabilityTool]
          })
        );
      });     
    });
  }
    
  addtoolAssignment() {     
        
    if (this.toolAssignmentForm.valid) {
      const newToolAssignment: ToolAssignment = {
        date: this.toolAssignmentForm.value.date,
        reason: this.toolAssignmentForm.value.reason,
        observation: this.toolAssignmentForm.value.observation,
        collaboratorId: this.toolAssignmentForm.value.collaboratorId,
        details: this.tools
      };
      
      
      if (this.id != '') {

        //editar        
        const {id ,...rest} = newToolAssignment
        console.log(rest);
        
        this.toolAssignmentService.updateToolAssignment(this.id, rest)
        .subscribe({
          next: () => {
            this.showNotification(
              '¡Éxito!',
              'Assignación de herramienta Actualizado con éxito:',
              'success'
            );
            this.router.navigate(['dashboard/list-tools-assignment']);
          },
          error: (error) => {
            this.handleError(error);
          }
        });

      } else {
        
        this.toolAssignmentService.saveToolAssignment(newToolAssignment)
      .subscribe({
        next: () => {
          this.showNotification(
            '¡Éxito!',
            'Assignación de herramienta Agregado con éxito:',
            'success'
          );
          this.router.navigate(['dashboard/list-tools-assignment']);
        },
        error: (error) => {
          this.handleError(error);
        }
      });
      }
      
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
