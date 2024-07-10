import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UiModulesModule } from 'src/app/dashboard/components/ui-modules/ui-modules.module';
import { MaterialPeAlPe } from 'src/app/dashboard/interfaces/assignmentPeAlPinterface';
import { AssignmentPeAlPeService } from 'src/app/dashboard/services/assignment-pe-al-pe.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-assignment-pealpe',
  standalone: true,
  imports: [
    CommonModule, UiModulesModule
  ],
  templateUrl:'./list-assignment-pealpe.componenet.html',
  styles: [`
    :host {
      display: block;
    }
  `],
})
export class ListAssignmentPealpeComponent {
  public assignmentMaterialsPeAlPe: MaterialPeAlPe[] = [];  
  public assignmentMaterialPeAlPeTemp: MaterialPeAlPe[] = [];
  public loading: boolean = true;  
  public assignmentMaterialPeAlPeCount: number = 0;
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];


  constructor(private assignmentMaterialPeAlPeService: AssignmentPeAlPeService,    
    private router: Router) { }


    ngOnInit(): void{
      this.getListToolAssignment();
      };
   
     getListToolAssignment(){
      this.loading = true;
       this.assignmentMaterialPeAlPeService.getMaterialPeAlPe()
    .subscribe((data: MaterialPeAlPe[]) => { 
      this.assignmentMaterialsPeAlPe = data;
      this.assignmentMaterialsPeAlPe.sort((a, b) => a.collaborator.name.localeCompare(b.collaborator.name));
     
      this.assignmentMaterialPeAlPeTemp = data;  
      this.loading = false;
      } );
     }

     getTotalAssignedQuantity(details: any[]): number {
      return details.reduce((total, detail) => total + detail.assignedQuantity, 0);
    }
    
    getTotalUsedQuantity(details: any[]): number {
      return details.reduce((total, detail) => total + detail.used, 0);
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
   
    deleteMaterialPeAlPe(assignmentMaterialPeAlPe:MaterialPeAlPe) {
  
  
      Swal.fire({
        title: '¿Borrar asignación de pe al pe?',
        text: `Esta a punto de borrar asignación de pe al pe ${ assignmentMaterialPeAlPe.id}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Si, borrar'
      }).then((result) => {
        if (result.value) {
  
          this.assignmentMaterialPeAlPeService.deleteMaterialPeAlPe( assignmentMaterialPeAlPe )
            .subscribe( resp => {
  
              this.getListToolAssignment();
              Swal.fire(
                'Asignación de herramienta borrada',
                `asignación de herramienta ${ assignmentMaterialPeAlPe.id } fue eliminada correctamente`,
                'success'
              );
  
            });
  
        }
      })
    }

    downloadMaterialPeAlPe(asignmentMaterialPeAlPe: MaterialPeAlPe) {
      const id = asignmentMaterialPeAlPe.id; // replace with your transfer ID
    const collaborator =asignmentMaterialPeAlPe.collaborator.name
    this.assignmentMaterialPeAlPeService.downloadPDF(id).subscribe((data: ArrayBuffer) => {
      // Crea un Blob a partir del ArrayBuffer recibido
      const blob = new Blob([data], { type: 'application/pdf' });
    
      // Crea una URL para el Blob y utiliza un enlace <a> para iniciar la descarga del archivo
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.download = `Asignación_${collaborator}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);

    });
    }
  

    detailMaterialPeAlPe(assignmentMaterialPeAlPe: MaterialPeAlPe){      
      this.router.navigate(['dashboard/details-assignment-pe-al-pe', assignmentMaterialPeAlPe.id]);
      }
    // updateMaterialVehicle(toolAssignment: ToolAssignment){
    //   this.router.navigate(['dashboard/edit-assignment-materials-vehicles/',toolAssignment.id]);
    // }
  
    addMaterialPeAlPe():void{
      this.router.navigate(['dashboard/add-assignment-pe-al-pe']);
    }
 }
