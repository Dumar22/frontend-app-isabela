import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialPeAlPe } from 'src/app/dashboard/interfaces/assignmentPeAlPinterface';
import { AssignmentPeAlPeService } from 'src/app/dashboard/services/assignment-pe-al-pe.service';

@Component({
  selector: 'app-details-assignment-pe-al-pe',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './details-assignment-pe-al-pe.component.html',
  styles: [`
    :host {
      display: block;
    }
  `],
})
export class DetailsAssignmentPeAlPeComponent { 

  assignmentMaterialPeAlPe: MaterialPeAlPe

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assignmentMaterialPeAlPeService: AssignmentPeAlPeService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.assignmentMaterialPeAlPeService.getMaterialPeAlPeById(id).subscribe((data: MaterialPeAlPe) => {
      this.assignmentMaterialPeAlPe = data;     
      console.log(data);
                
     });
  }

  editMaterialPeAlPe(materialPeAlPe: MaterialPeAlPe) {
    this.router.navigate(['dashboard/edit-assignment-pe-al-pe', materialPeAlPe.id]);
  }
  prev() {
    this.router.navigate(['dashboard/list-assignment-pe-al-pe']);
  }
}
