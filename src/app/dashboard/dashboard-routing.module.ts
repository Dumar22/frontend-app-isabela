import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ListUsersComponent } from './pages/users/list-users/list-users.component';
import { AddUserComponent } from './pages/users/add-user/add-user.component';
import { EditUserComponent } from './pages/users/edit-user/edit-user.component';
import { AddEditComponent } from './pages/materials/add-edit-material/add-edit.component';
import { ListComponent } from './pages/materials/list-materials/list.component';
import { ListWarehousesComponent } from './pages/warehouses/list-warehouses/list-warehouses.component';
import { AddEditWarehouseComponent } from './pages/warehouses/add-edit-warehouse/add-edit-warehouse.component';
import { ListProvidersComponent } from './pages/providers/list-providers/list-providers.component';
import { AddEditprovidersComponent } from './pages/providers/add-editproviders/add-editproviders.component';
import { ListCollaboratorsComponent } from './pages/collaborators/list-collaborators/list-collaborators.component';
import { AddEditCollaboratorComponent } from './pages/collaborators/add-edit-collaborator/add-edit-collaborator.component';
import { ListEntriesComponent } from './pages/entries/list-entries/list-entries.component';
import { AddEditEntriesComponent } from './pages/entries/add-edit-entries/add-edit-entries.component';
import { ListTransferComponent } from './pages/transfer/list-transfer/list-transfer.component';
import { ListexitMaterialsComponent } from './pages/exit-materials/listexit-materials/listexit-materials.component';
import { MeterListComponent } from './pages/materials/meter-list/meter-list.component';
import { AddEditMeterComponent } from './pages/materials/add-edit-meter/add-edit-meter.component';
import { DetailsEntriesComponent } from './pages/entries/details-entries/details-entries.component';
import { AddEditTransferComponent } from './pages/transfer/add-edit-transfer/add-edit-transfer.component';
import { AddMaterialsComponent } from './pages/exit-materials/add-edit-materials/add-edit-materials.component';
import { LoadFilesComponent } from './pages/load-files/load-files.component';
import { DetailsExitComponent } from './pages/exit-materials/details-exit/details-exit.component';
import { ListWorkRegisterComponent } from './pages/work-register/list-work-register/list-work-register.component';
import { AddEditWorkRegisterComponent } from './pages/work-register/add-edit-work-register/add-edit-work-register.component';
import { DetailsTransferComponent } from './pages/transfer/details-transfer/details-transfer.component';
import { ListToolsComponent } from './pages/tools/list-tools/list-tools.component';
import { AddEditToolsComponent } from './pages/tools/add-edit-tools/add-edit-tools.component';
import { ListVehiclesComponent } from './pages/transport/list-vehicles/list-vehicles.component';
import { AddEditVehicleComponent } from './pages/transport/add-edit-vehicle/add-edit-vehicle.component';
import { ListToolAsignamentComponent } from './pages/tool-assignment/list-tool-asignament/list-tool-asignament.component';
import { DetailsToolAssignmentComponent } from './pages/tool-assignment/details-tool-assignment/details-tool-assignment.component';
import { AddEditToolAssignmentComponent } from './pages/tool-assignment/add-edit-tool-assignment/add-edit-tool-assignment.component';
import { ListAssignmentMaterialsVehicleComponent } from './pages/assignment-materials-vehicles/list-assignment-materials-vehicle/list-assignment-materials-vehicle.component';
import { AddEditAssignmentMaterialsVehicleComponent } from './pages/assignment-materials-vehicles/add-edit-assignment-materials-vehicle/add-edit-assignment-materials-vehicle.component';
import { DetailsAssignmentmaterialsVehicleComponent } from './pages/assignment-materials-vehicles/details-assignmentmaterials-vehicle/details-assignmentmaterials-vehicle.component';
import { EditExitComponent } from './pages/exit-materials/edit-exit/edit-exit.component';
import { ListProyectsComponent } from './pages/proyects/listProyects/listProyects.component';
import { AddEditProyectComponent } from './pages/proyects/addEditProyect/addEditProyect.component';
import { ListEntriesToolsComponent } from './pages/entries-tools/list-entries-tools/list-entries-tools.component';
import { DetailsEnriesToolsComponent } from './pages/entries-tools/details-enries-tools/details-enries-tools.component';
import { AddEditEntriesToolsComponent } from './pages/entries-tools/add-edit-entries-tools/add-edit-entries-tools.component';
import { AddExitListComponent } from './pages/exit-materials/add-exit-list/add-exit-list.component';
import { TableListExistComponent } from './pages/exit-materials/tableListExist/tableListExist.component';
import { DetailsTableListComponent } from './pages/exit-materials/details-table-list/details-table-list.component';
import { ListAssignmentPealpeComponent } from './pages/assignment-pe-al-pe/list-assignment-pealpe/list-assignment-pealpe.component';
import { AddEditAsiignmentPeAlPeComponent } from './pages/assignment-pe-al-pe/add-edit-asiignment-pe-al-pe/add-edit-asiignment-pe-al-pe.component';
import { DetailsAssignmentPeAlPeComponent } from './pages/assignment-pe-al-pe/details-assignment-pe-al-pe/details-assignment-pe-al-pe.component';
import { ExitForListComponent } from './pages/exit-materials/exit-for-list/exit-for-list.component';
import { EntriFileComponent } from './pages/entries/entriFile/entriFile.component';


export const routes: Routes = [
  { path: '', component: HomeComponent,
   children:[    
  
  { path: 'list-users', component: ListUsersComponent },
  { path: 'add-user', component: AddUserComponent },
  { path: 'edit-user/:id', component: EditUserComponent},
  { path: 'list-tools',component: ListToolsComponent},
  { path: 'add-tool',component: AddEditToolsComponent},
  { path: 'edit-tool/:id',component: AddEditToolsComponent},
  { path: 'list-materials',component: ListComponent},
  { path: 'add',component: AddEditComponent},
  { path: 'edit/:id',component: AddEditComponent},
  { path: 'list-meters',component: MeterListComponent},
  { path: 'add-meter',component: AddEditMeterComponent},
  { path: 'edit-meter/:id',component: AddEditMeterComponent},
  {path: 'list-warehuses',component:ListWarehousesComponent},
  {path: 'addwarehuse',component:AddEditWarehouseComponent},
  {path: 'editwarehuse/:id',component:AddEditWarehouseComponent},  
  {path: 'list-proyect',component:ListProyectsComponent},
  {path: 'editproyect/:id',component:AddEditProyectComponent},  
  {path: 'addproyect',component:AddEditProyectComponent},
  {path: 'list-providers',component:ListProvidersComponent},
  {path: 'list-vehicles',component:ListVehiclesComponent},
  {path: 'add-edit-vehicle',component:AddEditVehicleComponent},
  {path: 'add-edit-vehicle/:id',component:AddEditVehicleComponent},
  {path: 'addprovider',component:AddEditprovidersComponent},
  {path: 'editprovider/:id',component:AddEditprovidersComponent},
  {path: 'list-work-register',component:ListWorkRegisterComponent},
  {path: 'add-work-register',component:AddEditWorkRegisterComponent},
  {path: 'edit-work-register/:id',component:AddEditWorkRegisterComponent},
  {path: 'list-collaborators',component:ListCollaboratorsComponent},
  {path: 'addcollaborators',component:AddEditCollaboratorComponent},
  {path: 'editcollaborator/:id',component:AddEditCollaboratorComponent},
  {path: 'list-entries',component:ListEntriesComponent},
  {path: 'details-entries/:id',component:DetailsEntriesComponent},
  {path: 'add-entry',component:AddEditEntriesComponent},
  {path: 'add-entry-xls',component:EntriFileComponent},
  {path: 'edit-entry/:id',component:AddEditEntriesComponent},
  {path: 'list-trasfers',component:ListTransferComponent},
  {path: 'add-transfer',component:AddEditTransferComponent},
  {path: 'edit-transfer/:id',component:AddEditTransferComponent},
  {path: 'list-tools-assignment',component:ListToolAsignamentComponent},
  {path: 'add-tools-assignment',component:AddEditToolAssignmentComponent},
  {path: 'add-tools-assignment/:id',component:AddEditToolAssignmentComponent},
  {path: 'edit-tools-assignment/:id',component:AddEditToolAssignmentComponent},
  {path: 'details-tools-assignment/:id',component:DetailsToolAssignmentComponent},
  {path: 'list-assignment-materials-vehicles',component:ListAssignmentMaterialsVehicleComponent},
  {path: 'add-assignment-materials-vehicles',component:AddEditAssignmentMaterialsVehicleComponent},
  {path: 'edit-assignment-materials-vehicles/:id',component:AddEditAssignmentMaterialsVehicleComponent},
  {path: 'details-assignment-materials-vehicles/:id',component:DetailsAssignmentmaterialsVehicleComponent},
  {path: 'list-assignment-pe-al-pe',component:ListAssignmentPealpeComponent},
  {path: 'add-assignment-pe-al-pe',component:AddEditAsiignmentPeAlPeComponent},
  {path: 'edit-assignment-pe-al-pe/:id',component:AddEditAsiignmentPeAlPeComponent},
  {path: 'details-assignment-pe-al-pe/:id',component:DetailsAssignmentPeAlPeComponent},
  {path: 'details-transfer/:id',component:DetailsTransferComponent},
  {path: 'list-exit-materials',component:ListexitMaterialsComponent},
  {path: 'details-exit/:id',component:DetailsExitComponent},
  {path: 'add-exit-material',component:AddMaterialsComponent},
  {path: 'add-exit-material-list',component:ExitForListComponent},
  {path: 'add-exit-material-list:/id',component:ExitForListComponent},
  { path: 'add-list',component: AddExitListComponent},
  { path: 'list-table-exit',component: TableListExistComponent},
  { path: 'details-list-table-exit/:id',component: DetailsTableListComponent},
  {path: 'edit-exit-material/:id',component:EditExitComponent},
  {path: 'load-file',component:LoadFilesComponent},
  {path: 'list-entries-tools',component:ListEntriesToolsComponent},
  {path: 'details-entries-tools/:id',component:DetailsEnriesToolsComponent},
  {path: 'add-entry-tools',component:AddEditEntriesToolsComponent},
  {path: 'edit-entry-tools/:id',component:AddEditEntriesToolsComponent},
 
]
}
] 

  

@NgModule({
   imports: [ RouterModule.forChild(routes) ],
   exports: [ RouterModule ]
})
export class DashboardRoutingModule { }
