import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UiModulesModule } from 'src/app/dashboard/components/ui-modules/ui-modules.module';
import { Proyect } from 'src/app/dashboard/interfaces/proyectsInterface';
import { ProyectsService } from 'src/app/dashboard/services/proyects.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-proyects',
  standalone: true,
  imports: [
    CommonModule, UiModulesModule
  ],
  templateUrl:'./listProyect.html' ,
  styleUrls: ['./listProyects.component.css']
})
export class ListProyectsComponent {

  public proyects: any[] = [];
  public proyectsTemp: Proyect[] = [];
  public total: number; 
  public loading: boolean = true;
  limit = 20; // Establecer el límite de unidades para marcar en amarillo
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];

  constructor(private proyectService: ProyectsService,
  
    private router: Router) { }

  ngOnInit(): void{

    this.getListTools();

   };

   getListTools(){

    this.loading = true;
    this.proyectService.getProyects()
    .subscribe((data: any) =>{     
      this.total = data.total;
      this.proyects = data;

      this.proyectsTemp = data;
      this.loading = false;
    } );
   }


   onTableDataChange(event: any) {
    this.page = event;
    this.getListTools();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getListTools();
  }

   //Buscar

   search (term: string ):void {

    if ( term.length === 0 ) {
      this.proyects = this.proyectsTemp;
      return ;
    }
     this.proyectService.searchProyect( term )
          .subscribe( resp => {
            this.proyects = resp ;
          });
    }

   deleteProyect(tool:Proyect) {
    Swal.fire({
      title: '¿Borrar Herramienta?',
      text: `Esta a punto de borrar a ${ tool.name }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
      if (result.value) {

        this.proyectService.deleteTool( tool )
          .subscribe( resp => {

            this.getListTools();
            Swal.fire(
              'Herramienta borrada',
              `${ tool.name } fue eliminado correctamente`,
              'success'
            );

          });

      }
    })


  }   

  updateTool(proyect: Proyect){
    this.router.navigate(['dashboard/editproyect/',proyect.id]);
  }

  addTool():void{
    this.router.navigate(['dashboard/addproyect']);
  }




 }
