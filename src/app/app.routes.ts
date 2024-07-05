
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProjectListingComponent } from './pages/project-listing/project-listing.component';
import { CreateProjectComponent } from './pages/create-project/create-project.component';
import { authGuard } from './services/auth.guard';
import { ResponsiveComponent } from './pages/responsive/responsive.component';


export const routes: Routes = [
    {path:'login', component:LoginComponent},
    {path:'dashboard', component:DashboardComponent, canActivate: [authGuard] },
    {path:'projectlist', component:ProjectListingComponent, canActivate: [authGuard] },
    {path:'createproject',component:CreateProjectComponent, canActivate: [authGuard] },
    {path:'test',component:ResponsiveComponent},
    {path:'', redirectTo:'/login',pathMatch:'full'}
];


  