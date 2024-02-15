import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup,ReactiveFormsModule, Validators } from '@angular/forms';
import { Material } from 'src/app/dashboard/interfaces/materialsInterface';
import { MaterialsService } from 'src/app/dashboard/services/materials.service';

@Component({
  selector: 'add-edet-details-assignment-materials-vehicle',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule
  ],
  templateUrl: './add-edet-details-assignment-materials-vehicle.component.html',
  styleUrls: ['./add-edet-details-assignment-materials-vehicle.component.css'],

})
export class AddEdetDetailsAssignmentMaterialsVehicleComponent {


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

  getListMaterials(){
    this.materialService.getMaterials()
    .subscribe((data:Material[]) =>{ 
      this.material = data.filter(material => material.quantity >= 1);
      this.material.sort((a, b) => a.name.localeCompare(b.name));    
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
