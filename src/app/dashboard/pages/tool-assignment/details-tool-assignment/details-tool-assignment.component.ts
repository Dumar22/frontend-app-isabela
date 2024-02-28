import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Collaborator } from 'src/app/dashboard/interfaces/collaboratorInterface';
import { Tool, ToolAssignment } from 'src/app/dashboard/interfaces/tool-assignmentInterface';
import { CollaboratorService } from 'src/app/dashboard/services/collaborator.service';
import { ToolAssignmentService } from 'src/app/dashboard/services/toolAssignment.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'details-tool-assignment',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './details-tool-assignment.component.html',
  styleUrls: ['./details-tool-assignment.component.css']
})
export class DetailsToolAssignmentComponent { 

  toolAssignment: ToolAssignment;
  details: Tool[]
  collaborator: Collaborator
  loading: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toolAssignmentService: ToolAssignmentService,
    private collaboratorService: CollaboratorService
  ) { }

ngOnInit(): void{

  const assignmentId = this.route.snapshot.paramMap.get('id'); 
    
  this.toolAssignmentService.getToolAssignmentById(assignmentId).
  subscribe((data: ToolAssignment) => {      
     
    this.toolAssignment = data
  
   });
 
  }


 getListToolAssignment( assisment: ToolAssignment){
  //tomar el id de la asignación
  
    
  
 }


  remove(toolAssignment: ToolAssignment) {
    Swal.fire({
      title: '¿Borrar asignación de herramienta?',
      text: `Esta a punto de borrar asignación de herramienta ${toolAssignment.id}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar',
    }).then((result) => {
      if (result.value) {
        this.toolAssignmentService
          .deleteToolAssignment(toolAssignment)
          .subscribe((resp) => {

            Swal.fire(
              'Asignación de herramienta borrada',
              `asignación de herramienta ${toolAssignment.id} fue eliminada correctamente`,
              'success'
            );
          });
      }
    });
  }

  
  editToolAssignment(toolAssignment: ToolAssignment) {
    this.router.navigate(['dashboard/edit-tools-assignment', toolAssignment.id]);
  }
  prev() {
    this.router.navigate(['dashboard/list-tools-assignment']);
  }

  updateToolAssignment(toolAssignment: ToolAssignment) {
    this.router.navigate([
      'dashboard/edit-tools-assignment/',
      toolAssignment.id,
    ]);
  }

}
