import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tools } from 'src/app/dashboard/interfaces/toolsInterface';
import { ToolsService } from 'src/app/dashboard/services/tools.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UiModulesModule } from 'src/app/dashboard/components/ui-modules/ui-modules.module';

@Component({
  standalone: true,
  imports: [CommonModule,UiModulesModule],
  templateUrl: './list-tools.component.html',
  styleUrls: ['./list-tools.component.css']
})
export class ListToolsComponent implements OnInit {

  public tools: any[] = [];
  public toolsTemp: Tools[] = [];
  public total: number; 
  public loading: boolean = true;
  limit = 20; // Establecer el límite de unidades para marcar en amarillo
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];

  constructor(private toolsService: ToolsService,
    
    private router: Router) { }

  ngOnInit(): void{

    this.getListTools();

   };

   getListTools(){

    this.loading = true;
    this.toolsService.getTools()
    .subscribe((data: any) =>{
      this.total = data.total;
      this.tools = data;
      this.tools.sort((a, b) => a.name.localeCompare(b.name));
      this.toolsTemp = data;
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
 search (term: string ) {

  if ( term.length === 0 ) {
    this.tools = this.toolsTemp;
    return ;
  }
   this.toolsService.searchTool( term )
        .subscribe( resp => {
          this.tools = resp ;
        });
  }

   deleteTool(tool:Tools) {


    Swal.fire({
      title: '¿Borrar Herramienta?',
      text: `Esta a punto de borrar a ${ tool.name }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
      if (result.value) {

        this.toolsService.deleteTool( tool )
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

  updateTool(tool: Tools){
    this.router.navigate(['dashboard/edit-tool/',tool.id]);
  }

  addTool():void{
    this.router.navigate(['dashboard/add-tool']);
  }





}
