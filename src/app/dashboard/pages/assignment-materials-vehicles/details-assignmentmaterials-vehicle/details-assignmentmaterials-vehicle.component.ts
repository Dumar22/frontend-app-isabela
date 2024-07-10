import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialVehicle } from 'src/app/dashboard/interfaces/assignmentMaterialsVehicleInterface';
import { AssignmentMaterialsVehicleService } from 'src/app/dashboard/services/assignmentMaterialsVehicle.service';

@Component({
  selector: 'app-details-assignmentmaterials-vehicle',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './details-assignmentmaterials-vehicle.component.html',
  styleUrls: ['./details-assignmentmaterials-vehicle.component.css'],
  
})
export class DetailsAssignmentmaterialsVehicleComponent { 
  assignmentMaterialVehicle: MaterialVehicle

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assignmentMaterialsVehicleService: AssignmentMaterialsVehicleService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.assignmentMaterialsVehicleService.getMaterialVehicleById(id).subscribe((data: MaterialVehicle) => {
      this.assignmentMaterialVehicle = data;               
     });
  }

  editToolAssignment(toolAssignment: MaterialVehicle) {
    this.router.navigate(['dashboard/edit-assignment-materials-vehicles', toolAssignment.id]);
  }
  prev() {
    this.router.navigate(['dashboard/list-assignment-materials-vehicles']);
  }

}
