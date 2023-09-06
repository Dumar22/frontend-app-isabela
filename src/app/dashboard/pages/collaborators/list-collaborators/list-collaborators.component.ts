import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Collaborator, CollaboratorClass } from 'src/app/dashboard/interfaces/collaboratorInterface';
import { CollaboratorService } from '../../../services/list-collaborator.service';
import { SearchService } from 'src/app/dashboard/services/search.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UiModulesModule } from 'src/app/dashboard/components/ui-modules/ui-modules.module';

@Component({
  selector: 'list-collaborators',
  standalone: true,
  imports: [CommonModule, UiModulesModule],
  templateUrl: './list-collaborators.component.html',
  styleUrls: ['./list-collaborators.component.css']
})
export class ListCollaboratorsComponent implements OnInit {

  public collaborators: any[] = []; 
  public total: number; 
  public collaboratorTemp: CollaboratorClass[] = [];
  public desde: number = 0;
  public loading: boolean = true;
   page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];


  constructor(private collaboratorService: CollaboratorService,
    private searchService: SearchService,
    private router: Router) { }

  ngOnInit(): void{
    this.getListCollaborators();
   };

   getListCollaborators(){
    this.loading = true;
    this.collaboratorService.loadCollaborators(this.desde)
    .subscribe( ({ total, collaborator }) => {
      this.total = total;
      this.collaborators = collaborator;
      this.collaborators.sort((a, b) => a.name.localeCompare(b.name));
      this.collaboratorTemp = collaborator;
      this.loading = false;
    } );
   }

   onTableDataChange(event: any) {
    this.page = event;
    this.getListCollaborators();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getListCollaborators();
  }


   //Buscar
 search (term: string ) {

  if ( term.length === 0 ) {
    this.collaborators = this.collaboratorTemp;
    return ;
  }
   this.searchService.search('collaborators', term )
        .subscribe( resp => {
          this.collaborators = resp;
        });
  }


   deleteCollaborator(collaborator:Collaborator) {


    Swal.fire({
      title: '¿Borrar movil?',
      text: `Esta a punto de borrar a ${ collaborator.name }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.value) {

        this.collaboratorService.deleteCollaborator( collaborator )
          .subscribe( resp => {

            this.getListCollaborators();
            Swal.fire(
              'Movil borrado',
              `${ collaborator.name } fue eliminado correctamente`,
              'success'
            );

          });

      }
    })
  }

  updateCollaborator(collaborator: Collaborator){
    this.router.navigate(['dashboard/editcollaborator/',collaborator.id]);
  }

  addCollaborator():void{
    this.router.navigate(['dashboard/addcollaborators']);
  }

}
