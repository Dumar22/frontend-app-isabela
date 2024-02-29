import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialsService } from '../../../services/materials.service';
import { Material } from 'src/app/dashboard/interfaces/materialsInterface';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UiModulesModule } from 'src/app/dashboard/components/ui-modules/ui-modules.module';



@Component({
  selector: 'list-materials',
  standalone: true,
  imports: [CommonModule, UiModulesModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  public materials: Material[] = [];
  public materialsTemp: Material[] = [];
  public total: number; 
  public loading: boolean = true;
  totalValue: number = 0;
  limit = 20; // Establecer el límite de unidades para marcar en amarillo
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];

  constructor(private materialsService: MaterialsService,
    
    private router: Router) { }

  ngOnInit(): void{

    this.getListMaterials();
 
   };

   getListMaterials(){

    this.loading = true;
    this.materialsService.getMaterials()
    .subscribe((data: Material[]) => {     
      this.materials = data.filter(material => material.quantity >= 1);   
      this.materials.sort((a, b) => a.name.localeCompare(b.name));

    this.totalValue = this.materials.reduce((total, material) => total + material.total, 0);
       
      this.materialsTemp = data;
      this.materialsTemp.sort((a, b) => a.name.localeCompare(b.name));
      this.loading = false;
    } );
   }



   onTableDataChange(event: any) {
    this.page = event;
    this.getListMaterials();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getListMaterials();
  }


  
   //Buscar
 search (term: string ):void {

  if ( term.length === 0 ) {
    this.materials = this.materialsTemp;
    this.materials.sort((a, b) => a.name.localeCompare(b.name));
    return ;
  }
   this.materialsService.searchMaterial( term )
        .subscribe( resp => {
          this.materials = resp ;
          this.materials.sort((a, b) => a.name.localeCompare(b.name));
        });
  }





   deleteMaterial(material:Material) {


    Swal.fire({
      title: '¿Borrar Material?',
      text: `Esta a punto de borrar a ${ material.name }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.value) {

        this.materialsService.deleteMaterial( material )
          .subscribe( resp => {

            this.getListMaterials();
            Swal.fire(
              'Material borrado',
              `${ material.name } fue eliminado correctamente`,
              'success'
            );

          });

      }
    })


  }   

  updateMaterial(material: Material){
    this.router.navigate(['dashboard/edit/',material.id]);
  }

  addMaterial():void{
    this.router.navigate(['dashboard/add']);
  }





}




