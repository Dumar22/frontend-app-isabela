import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialsService } from '../../../services/materials.service';
import { Material } from 'src/app/dashboard/interfaces/materialsInterface';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SearchService } from 'src/app/dashboard/services/search.service';



@Component({
  selector: 'list-materials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  public materials: any[] = [];
  public materialsTemp: Material[] = [];
  public total: number; 
  public loading: boolean = true;
  limit = 5; // Establecer el límite de unidades para marcar en amarillo
  constructor(private materialsService: MaterialsService,
    private searchService: SearchService,
    private router: Router) { }

  ngOnInit(): void{

    this.getListMaterials();

   };

   getListMaterials(){

    this.loading = true;
    this.materialsService.getMaterials()
    .subscribe((data: any) =>{
      this.total = data.total;
      this.materials = data.materials;
      this.materialsTemp = data.materials;
      this.loading = false;
    } );
   }

   //Buscar
 search (term: string ) {

  if ( term.length === 0 ) {
    this.materials = this.materialsTemp;
    return ;
  }
   this.searchService.search('materials', term )
        .subscribe( resp => {
          this.materials = resp ;
        });
  }

   deleteMaterial(material:Material) {


    Swal.fire({
      title: '¿Borrar material?',
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




