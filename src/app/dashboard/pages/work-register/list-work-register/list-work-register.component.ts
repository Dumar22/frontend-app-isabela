import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkRegister } from 'src/app/dashboard/interfaces/workRegisterInterface';
import { WorkRegisterService } from 'src/app/dashboard/services/work-install.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UiModulesModule } from 'src/app/dashboard/components/ui-modules/ui-modules.module';

@Component({
  standalone: true,
  imports: [CommonModule, UiModulesModule],
  templateUrl: './list-work-register.component.html',
  styleUrls: ['./list-work-register.component.css']
})
export class ListWorkRegisterComponent {
  public workRegister: any[] = [];
  public workRegisterTemp: WorkRegister[] = [];
  public total: number; 
  public loading: boolean = true;
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];
 
  
  constructor(private workRegisterService: WorkRegisterService,
    private router: Router) { }

  ngOnInit(): void{

    this.getListWorkRegister();

   };

   getListWorkRegister(){

    this.loading = true;
    this.workRegisterService.getWorkRegister()
    .subscribe((data: any) =>{
           
      this.total = data.total;        
      this.workRegister = data;
      this.workRegister.sort((a, b) => a.contractNumber.localeCompare(b.contractNumber));
      this.workRegisterTemp = data;
      this.loading = false;
    } );
   }

   onTableDataChange(event: any) {
    this.page = event;
    this.getListWorkRegister();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getListWorkRegister();
  }
   //Buscar
 search (term: string ) {

  if ( term.length === 0 ) {
    this.workRegister = this.workRegisterTemp;
    return ;
  }
   this.workRegisterService.searchWorkRegister( term )
        .subscribe( resp => {
          this.workRegister = resp ;
        });
  }

   deleteMaterial(workRegister:WorkRegister) {


    Swal.fire({
      title: '¿Borrar Contrato?',
      text: `Esta a punto de borrar el contarto ${ workRegister.contract }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
      if (result.value) {

        this.workRegisterService.deleteWorkRegister( workRegister )
          .subscribe( resp => {

            this.getListWorkRegister();
            Swal.fire(
              'Matrícula borrada',
              `${ workRegister.contract } fue eliminada correctamente`,
              'success'
            );

          });

      }
    })


  }   

  tracking(workRegister: WorkRegister){
    alert('Estamos trabajando en este componente...')
    // this.router.navigate(['dashboard/edit-work-register/',workRegister.id]);
  }
  updateMaterial(workRegister: WorkRegister){
    this.router.navigate(['dashboard/edit-work-register/',workRegister.id]);
  }

  addMaterial():void{
    this.router.navigate(['dashboard/add-work-register']);
  }
}
