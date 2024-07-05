import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { SidenavComponent } from './pages/sidenav/sidenav.component';
import { LoginComponent } from './pages/login/login.component';
import { CreateProjectComponent } from './pages/create-project/create-project.component';
import { ResponsiveComponent } from './pages/responsive/responsive.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HttpClientModule, SidenavComponent,
    LoginComponent,CreateProjectComponent,ResponsiveComponent],
  providers:[ApiService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Techprimelab';
}
