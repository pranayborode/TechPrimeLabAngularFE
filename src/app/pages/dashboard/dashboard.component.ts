import { Component, OnInit } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { Router, RouterLink } from '@angular/router';
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
            const percentage = this.successPercentageByDepartment[index].toFixed(2);
            return `${percentage}%\n${department}`;
          }),
          datasets: [
            {
              label: 'Total ',
              data: this.totalProjectsByDepartment,
              backgroundColor: 'blue'
            },
            {
              label: 'Closed ',
              data: this.closedProjectsByDepartment,
              backgroundColor: 'limegreen'
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            // title: {
            //   display: true,
            // text: 'Department-wise Total vs Closed',
            //   font: {
            //     size: 16
            //   }
            // },
            legend: {
              position: 'bottom',

            }
          },
          scales: {
            x: {
              ticks: {
                callback: function(value, index) {
                  const label = this.getLabelForValue(index).toString().split('\n');
                  return label;
                },
                font: {
                  size: 12
                }
              }
            }
          }
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
    
}
export interface SuccessPercentageByDepartment {
  [key: string]: number;
}
