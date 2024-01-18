import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { UiModulesModule } from 'src/app/dashboard/components/ui-modules/ui-modules.module';
import { MaterialVehicle } from 'src/app/dashboard/interfaces/assignmentMaterialsVehicleInterface';
import { ToolAssignment } from 'src/app/dashboard/interfaces/tool-assignmentInterface';
import { AssignmentMaterialsVehicleService } from 'src/app/dashboard/services/assignmentMaterialsVehicle.service';
import { SearchService } from 'src/app/dashboard/services/search.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'list-assignment-materials-vehicle',
  standalone: true,
  imports: [
    CommonModule, UiModulesModule
  ],
  templateUrl: './list-assignment-materials-vehicle.component.html',
  styleUrls: ['./list-assignment-materials-vehicle.component.css'],
})
export class ListAssignmentMaterialsVehicleComponent {

  public assignmentMaterialsVehicle: any[] = [];  
  public assignmentMaterialsVehicleTemp: MaterialVehicle[] = [];
  public loading: boolean = true;  
  public assignmentMaterialsVehicleCount: number = 0;
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];


  constructor(private assignmentMaterialsVehicleService: AssignmentMaterialsVehicleService,    
    private searchService: SearchService,
    private router: Router) { }


    ngOnInit(): void{
      this.getListToolAssignment();
      };
   
     getListToolAssignment(){
      this.loading = true;
       this.assignmentMaterialsVehicleService.getToolsAssignment()
    .subscribe((data: any) => { 
         
         
      this.assignmentMaterialsVehicle = data;
     
      this.assignmentMaterialsVehicleTemp = data;  
      this.loading = false;
      } );
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
   search (term: string ) {
  
    if ( term.length === 0 ) {
      this.assignmentMaterialsVehicle = this.assignmentMaterialsVehicle;
      return ;
    }
     this.searchService.search('providers', term )
          .subscribe( resp => {
            this.assignmentMaterialsVehicle = resp;
          });
    }
  
  
  
    deleteMaterialVehicle(assignmentMaterialVehicle:MaterialVehicle) {
  
  
      Swal.fire({
        title: '¿Borrar asignación de herramienta?',
        text: `Esta a punto de borrar asignación de herramienta ${ assignmentMaterialVehicle.id}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Si, borrar'
      }).then((result) => {
        if (result.value) {
  
          this.assignmentMaterialsVehicleService.deleteMaterialVehicle( assignmentMaterialVehicle )
            .subscribe( resp => {
  
              this.getListToolAssignment();
              Swal.fire(
                'Asignación de herramienta borrada',
                `asignación de herramienta ${ assignmentMaterialVehicle.id } fue eliminada correctamente`,
                'success'
              );
  
            });
  
        }
      })
    }

    downloadMaterialVehicle(asignmentMaterialVehicle: MaterialVehicle) {
      console.log('dowload',asignmentMaterialVehicle.id);
      
      this.assignmentMaterialsVehicleService.downloadPDF(asignmentMaterialVehicle)
      .subscribe(response => {
        
        
  
     });
    }
  

    detailMaterialVehicle(assignmentMaterialVehicle: ToolAssignment){      
      this.router.navigate(['dashboard/details-assignment-materials-vehicles', assignmentMaterialVehicle.id]);
      }
    // updateMaterialVehicle(toolAssignment: ToolAssignment){
    //   this.router.navigate(['dashboard/edit-assignment-materials-vehicles/',toolAssignment.id]);
    // }
  
    addMaterialVehicle():void{
      this.router.navigate(['dashboard/add-assignment-materials-vehicles']);
    }
  

 }
