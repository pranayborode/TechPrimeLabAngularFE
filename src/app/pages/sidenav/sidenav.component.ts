import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterLink, CommonModule],
  providers: [ApiService],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent  implements OnInit {
 selectedIcon: string = '';

  constructor(private router: Router,private apiService: ApiService) { }

  ngOnInit(): void {
  
    this.setInitialSelectedIcon(this.router.url);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setInitialSelectedIcon(event.urlAfterRedirects || '');
      }
    });
  }

  toggleIcon(iconId: string): void {
    this.selectedIcon = iconId;
  }

  // Function to set initial selected icon based on current route
  setInitialSelectedIcon(url: string): void {
    switch (url) {
      case '/dashboard':
        this.selectedIcon = 'dashboardIcon';
        break;
      case '/projectlist':
        this.selectedIcon = 'ordersIcon';
        break;
      case '/createproject':
        this.selectedIcon = 'productsIcon';
        break;
      default:
        this.selectedIcon = '';
        break;
    }
  }

  confirmLogout(): void {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
  
      this.apiService.logout("User/Logout", { headers }).subscribe(
        () => {
          console.log("Logout successful");
          localStorage.removeItem('token');
          
          setTimeout(() => {
            alert("Logout successful");
          }, 1000); 
  
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error("Logout failed", error);
          alert("Logout failed. Please try again.");
        }
      );
    }
  }
}
