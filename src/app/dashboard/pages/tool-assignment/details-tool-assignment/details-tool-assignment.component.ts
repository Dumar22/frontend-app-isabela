import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolAssignment } from 'src/app/dashboard/interfaces/tool-assignmentInterface';
import { ToolAssignmentService } from 'src/app/dashboard/services/toolAssignment.service';

@Component({
  selector: 'app-details-tool-assignment',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './details-tool-assignment.component.html',
  styleUrls: ['./details-tool-assignment.component.css']
})
export class DetailsToolAssignmentComponent { 

  toolAssignment: ToolAssignment

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toolAssignmentService: ToolAssignmentService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.toolAssignmentService.getToolAssignmentById(id).subscribe((data: ToolAssignment) => {
      
      this.toolAssignment = data;               
     });
  }

  editToolAssignment(toolAssignment: ToolAssignment) {
    this.router.navigate(['dashboard/edit-tools-assignment', toolAssignment.id]);
  }
  prev() {
    this.router.navigate(['dashboard/list-tools-assignment']);
  }


}
