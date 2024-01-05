import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-add-edit-assignment-materials-vehicle',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `<p>add-edit-assignment-materials-vehicle works!</p>`,
  styleUrls: ['./add-edit-assignment-materials-vehicle.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEditAssignmentMaterialsVehicleComponent { }
