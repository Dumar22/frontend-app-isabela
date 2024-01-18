import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { UiModulesModule } from 'src/app/dashboard/components/ui-modules/ui-modules.module';
import { ToolAssignment } from 'src/app/dashboard/interfaces/tool-assignmentInterface';
import { SearchService } from 'src/app/dashboard/services/search.service';
import { ToolAssignmentService } from 'src/app/dashboard/services/toolAssignment.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-tool-asignament',
  standalone: true,
  imports: [CommonModule, UiModulesModule],
  templateUrl: './list-tool-asignament.component.html',
  styleUrls: ['./list-tool-asignament.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListToolAsignamentComponent {
  
  public toolAssignment: ToolAssignment[] = [];
  public toolAssignmentTemp: ToolAssignment[] = [];
  public loading: boolean = true;
  public toolAssignmentCount: number = 0;
  collaboratorsList: any[] = [];
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  
  tableSizes: any = [3, 6, 9, 12];
  constructor(
    private toolAssignmentService: ToolAssignmentService,
    private searchService: SearchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getListToolAssignment();
    this.getAssignedCollaborators();
  }

  getAssignedCollaborators() {
    
    this.toolAssignmentService
      .getToolsAssignment().subscribe((data: any[]) => {
      // Filtra la lista para mostrar solo un registro por colaborador.
      this.collaboratorsList = this.filterUniqueCollaborators(data);
    });
  }
  
  filterUniqueCollaborators(data: any[]): any[] {
    const uniqueCollaborators = [];
    const collaboratorIds = new Set();
  
    for (const item of data) {
      const collaboratorId = item.collaborator.id;
  
      if (!collaboratorIds.has(collaboratorId)) {
        collaboratorIds.add(collaboratorId);
        uniqueCollaborators.push(item);
      }
    }
  
    return uniqueCollaborators;
  }
 

  getListToolAssignment() {
    this.loading = true;
    this.toolAssignmentService
      .getToolsAssignment()
      .subscribe((data: ToolAssignment[]) => {
        this.toolAssignment = data;
        this.toolAssignmentTemp = data;

        this.loading = false;
      });
  }
  onTableDataChange(event: any) {
    this.page = event;
    this.getListToolAssignment();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getListToolAssignment();
  }

  //Buscar
  search(term: string) {
    if (term.length === 0) {
      this.toolAssignment = this.toolAssignment;
      return;
    }
    // this.searchService.search('providers', term).subscribe((resp) => {
    //   this.toolAssignment = resp;
    // });
  }

  deleteToolAssignment(toolAssignment: ToolAssignment) {
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
            this.getListToolAssignment();
            Swal.fire(
              'Asignación de herramienta borrada',
              `asignación de herramienta ${toolAssignment.id} fue eliminada correctamente`,
              'success'
            );
          });
      }
    });
  }

  downloadTransfer(toolAssignment: ToolAssignment) {
    console.log('dowload', toolAssignment.id);

    this.toolAssignmentService
      .downloadPDF(toolAssignment)
      .subscribe((response) => {});
  }

  detailsAssignmentTool(toolAssignment: ToolAssignment) {
    this.router.navigate([
      'dashboard/details-tools-assignment',
      toolAssignment.collaborator.id,
    ]);
  }

  addToolAssignment(toolAssignment: ToolAssignment) {
    this.router.navigate([
      'dashboard/add-tools-assignment/',
      toolAssignment.collaborator.id,
    ]);
  }
  

  // addToolAssignment(): void {
  //   this.router.navigate(['dashboard/add-tools-assignment']);
  // }
}
