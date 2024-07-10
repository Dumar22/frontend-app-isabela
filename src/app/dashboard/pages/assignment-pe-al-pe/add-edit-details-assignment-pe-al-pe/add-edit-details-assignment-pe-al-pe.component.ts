import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Material } from 'src/app/dashboard/interfaces/materialsInterface';
import { MaterialsService } from 'src/app/dashboard/services/materials.service';

@Component({
  selector: 'app-add-edit-details-assignment-pe-al-pe',
  standalone: true,
  imports: [
    CommonModule,  ReactiveFormsModule
  ],
  templateUrl: './add-edit-details-assignment-pe-al-pe.component.html',
  styles: [`
    :host {
      display: block;
    }
  `],
})
export class AddEditDetailsAssignmentPeAlPeComponent {

  @Input() materials: any[] = [];
  @Output() materialsChange = new EventEmitter<any[]>();

  formMaterial: FormGroup;

  material:Material[] = [];
  constructor(private formBuilder: FormBuilder, 
          private materialService: MaterialsService) {

           this.formMaterial = this.formBuilder.group({
            materialId: ['', Validators.required],
            assignedQuantity: ['', [Validators.required, Validators.min(1)]],
           
         });
     }

  ngOnInit(): void { 
    this.getListMaterials();   
  } 

  getListMaterials() {
    this.materialService.getMaterials()
      .subscribe((data: Material[]) => {
        // Filtrar los materiales por código Pe al Pe
        this.material = data.filter(material => material.code === '10006401');
      });
  }

 
  getMaterialProperty(materialId: string, propertyName: string): any {
    const selectedTool = this.material.find(material => material.id === materialId);
    return selectedTool ? selectedTool[propertyName] : null;
  }
  
  addTool() { 
    const selectedToolId = this.formMaterial.value.materialId;
     
  
        const newTool = {
            materialId: this.formMaterial.value.materialId,
            assignedQuantity: this.formMaterial.value.assignedQuantity,
           
           
        };
        
        this.materials.push(newTool);
        
        
        this.materialsChange.emit(this.materials);
        this.formMaterial.reset();
    
  }

  removeMaterial(material: any) {
    const index = this.materials.indexOf(material);
    if (index !== -1) {
      this.materials.splice(index, 1);
      this.materialsChange.emit(this.materials);
    }
  }
 }
