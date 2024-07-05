import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Project } from '../../models/project';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-project-listing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule, SidenavComponent],
  providers: [ApiService],
  templateUrl: './project-listing.component.html',
  styleUrl: './project-listing.component.css'
})
export class ProjectListingComponent implements OnInit {

  selectedIcon: string = '';
  projects: Project[] = [];
  projectList: any[] = [];
  filteredProjects: any[] = [];
  searchTerm: string = '';
  selectedSortColumn: string = '';
  isSortAscending: boolean = true;
  currentPage: number = 1;
  pageSize: number = 7;

  constructor(private apiService: ApiService, private router: Router) { }

  i: number = 0;
  ngOnInit(): void {
    this.getAllProjects();

    this.setInitialSelectedIcon(this.router.url);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setInitialSelectedIcon(event.urlAfterRedirects || '');
      }
    });
  }



  getAllProjects(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.apiService.getRequest("Project/GetAllProjects", { headers }).subscribe((data: Project[]) => {
      this.projects = data;
      console.log("AllProject", data);
      this.updateFilteredProjects();
      console.log("projects....")
      // console.log(this.projects)

    });
  }


  filterProjects() {
    if (!this.searchTerm.trim()) {

      this.filteredProjects = [...this.projects];
    } else {

      this.filteredProjects = this.projects.filter(project =>
        this.isProjectMatchingSearchTerm(project, this.searchTerm.toLowerCase())
      );
    }

  }

  isProjectMatchingSearchTerm(project: Project, searchTerm: string): boolean {

    return Object.values(project).some(value =>
      (typeof value === 'string' || typeof value === 'number') && value.toString().toLowerCase().includes(searchTerm)
    );
  }

  updateProjectStatus(projectId: number, statusId: number): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.apiService.putRequest(`Project/UpdateProjectStatus/${projectId}`, statusId, { headers })
      .subscribe(updatedProject => {
        console.log("Project status updated:", updatedProject);
        this.getAllProjects();
      }, error => {
        console.error("Error updating project status:", error);
      });
  }


  startProject(project: Project): void {
    if (project.projectId) this.updateProjectStatus(project.projectId, 2);
  }

  closeProject(project: Project): void {
    if (project.projectId) this.updateProjectStatus(project.projectId, 3);
  }

  cancelProject(project: Project): void {
    if (project.projectId) this.updateProjectStatus(project.projectId, 4);
  }



  sortFilteredProjects(): void {
    if (!this.selectedSortColumn) return;


    this.filteredProjects.sort((a, b) => {
      const valA = this.getValueForSorting(a, this.selectedSortColumn);
      const valB = this.getValueForSorting(b, this.selectedSortColumn);

      if (valA < valB) return this.isSortAscending ? -1 : 1;
      if (valA > valB) return this.isSortAscending ? 1 : -1;
      return 0;
    });
  }

  getValueForSorting(project: Project, column: string): any {
    switch (column) {
      case 'projectName':
        return project.projectName;
      case 'reason':
        return project.reasonName;
      case 'types':
        return project.typeName;
      case 'division':
        return project.divisionName;
      case 'category':
        return project.categoryName;
      case 'priority':
        return project.priorityName;
      case 'department':
        return project.departmentName;
      case 'location':
        return project.locationName;
      case 'status':
        return project.statusName;
      case 'startDate':
        return project.startDate ? new Date(project.startDate) : null;
      case 'endDate':
        return project.endDate ? new Date(project.endDate) : null;
      default:
        return project;
    }
  }


  applySort(): void {
    this.sortFilteredProjects();
  }


  // paginator
  onPageChange(pageNumber: number) {

    this.currentPage = pageNumber;

    this.updateFilteredProjects();
  }

  getPagesArray(): number[] {
    return Array(Math.ceil(this.projects.length / this.pageSize))
      .fill(0)
      .map((x, i) => i + 1);
  }

  get totalPages(): number {
    return Math.ceil(this.projects.length / this.pageSize);
  }

  updateFilteredProjects(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredProjects = this.projects.slice(startIndex, endIndex);
  }

  nextPage(): void {
    const totalPages = Math.ceil(this.projects.length / this.pageSize);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.updateFilteredProjects();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateFilteredProjects();
    }
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
          this.router.navigate(['/login']);
          // console.error("Logout failed", error);
          // alert("Logout failed. Please try again.");
        }
      );
    }
  }

}
