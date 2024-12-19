import { NgModule } from "@angular/core";
import { DashboardComponent } from "./dashboard.component";
import { SharedModule } from "../shared/shared.module";
import { ProjectsTableModule } from "../shared/projects-table/projects-table.module";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: '', component: DashboardComponent 
    }
]
@NgModule({
    declarations: [DashboardComponent],
    exports: [DashboardComponent],
    imports: [
        SharedModule, 
        ProjectsTableModule,
        RouterModule.forChild(routes)
    ],
})
export class DashboardModule{}