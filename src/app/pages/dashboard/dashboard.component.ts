import { Component, OnInit } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule,
    HttpClientModule, SidenavComponent],
  providers: [ApiService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  public chart: any;
  departments: string[] = [];
  totalProjectsByDepartment: number[] = [];
  closedProjectsByDepartment: number[] = [];
  successPercentageByDepartment: number[] = [];
  selectedIcon: string = '';
  totalProjects: number = 0;
  closedProjectsCount: number = 0;
  runningProjectsCount: number = 0;
  cancelledProjectsCount: number = 0;
  proWithEndDateBefore: number = 0;


  constructor(
    private apiService: ApiService,
    private router: Router,
    private http: HttpClient) { }


  ngOnInit(): void {
    this.getTotalProjectsCount();
    this.getClosedProjectsCount();
    this.getRunningProjectsCount();
    this.getCancelledProjectsCount();
    this.getCourseDelayCount();
    this.getProjectData();

    this.setInitialSelectedIcon(this.router.url);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setInitialSelectedIcon(event.urlAfterRedirects || '');
      }
    });
  }



  getProjectData(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.apiService.getRequest('Dashboard/ChartData', { headers }).subscribe(
      (data: { departmentName: string; totalProjects: number; totalProjectsClosed: number; }[]) => {
        this.departments = data.map((item) => item.departmentName);
        this.totalProjectsByDepartment = data.map((item) => item.totalProjects);
        this.closedProjectsByDepartment = data.map((item) => item.totalProjectsClosed);
        this.successPercentageByDepartment = this.totalProjectsByDepartment.map((total, index) => {
          const closed = this.closedProjectsByDepartment[index];
          return ((closed / total) * 100) || 0;
        });

        this.createChart();
        console.log("Chart Data:", this.departments, this.totalProjectsByDepartment, this.closedProjectsByDepartment);
      },
      (error) => {
        console.error('Error fetching project data:', error);
      }
    );
  }


  createChart(): void {
    const ctx = document.getElementById('MyChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.departments.map((department, index) => {
          const shortName = department.substring(0, 3).toUpperCase();
          const percentage = this.successPercentageByDepartment[index].toFixed(2);
          const formattedPercentage = parseFloat(percentage).toFixed(0);
          return `${formattedPercentage}%\n${shortName}`;
        }),
        datasets: [
          {
            label: 'Total ',
            data: this.totalProjectsByDepartment,
            backgroundColor: '#025AAB',
            barPercentage: 0.5,
            categoryPercentage: 0.5,
            borderRadius: 6,
          },
          {
            label: 'Closed ',
            data: this.closedProjectsByDepartment,
            backgroundColor: '#5AA647',
            barPercentage: 0.5,
            categoryPercentage: 0.5,
            borderRadius: 6,
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',

          }
        },
        scales: {
          x: {
            ticks: {
              callback: function (value, index) {
                const label = this.getLabelForValue(index).toString().split('\n');
                return label;
              },
              font: {
                size: 12
              }
            },
            grid: {
              display: false 
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              display: false 
            }
          }
        },

      }
    });
  }


  getTotalProjectsCount(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.apiService.getRequest('Dashboard/TotalProjects', { headers }).subscribe(
      (count: number) => {
        this.totalProjects = count;
      },
      (error) => {
        console.log('Error fetching total projects count:', error);
      }
    );
  }

  getClosedProjectsCount(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const statusName = 'Closed';
    this.apiService.getRequest(`Dashboard/CountByStatusName/${statusName}`, { headers }).subscribe(
      (count: number) => {
        this.closedProjectsCount = count;
      },
      (error) => {
        console.error('Error fetching closed projects count:', error);
      }
    );
  }

  getRunningProjectsCount(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const statusName = 'Running';
    this.apiService.getRequest(`Dashboard/CountByStatusName/${statusName}`, { headers }).subscribe(
      (count: number) => {
        this.runningProjectsCount = count;
      },
      (error) => {
        console.error('Error fetching closed projects count:', error);
      }
    );
  }

  getCancelledProjectsCount(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const statusName = 'Cancelled';
    this.apiService.getRequest(`Dashboard/CountByStatusName/${statusName}`, { headers }).subscribe(
      (count: number) => {
        this.cancelledProjectsCount = count;
      },
      (error) => {
        console.error('Error fetching closed projects count:', error);
      }
    );
  }

  getCourseDelayCount(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.apiService.getRequest('Dashboard/DelayedProjectsCount', { headers }).subscribe(
      (count: number) => {
        this.proWithEndDateBefore = count;
      },
      (error) => {
        console.log('Error fetching total projects count:', error);
      }
    );
  }


  toggleIcon(iconId: string): void {
    this.selectedIcon = iconId;
  }

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
export interface SuccessPercentageByDepartment {
  [key: string]: number;
}
