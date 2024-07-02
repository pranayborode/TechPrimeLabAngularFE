import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MultiSelectModule } from 'primeng/multiselect';
import { ApiService } from '../../services/api.service';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { Reason } from '../../models/reason';
import { Types } from '../../models/types';
import { Division } from '../../models/division';
import { Category } from '../../models/category';
import { Priority } from '../../models/priority';
import { Department } from '../../models/department';
import { Status } from '../../models/status';
import { Location } from '../../models/location';
@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,HttpClientModule,RouterOutlet,
    MultiSelectModule,  RouterLink, SidenavComponent],
    providers:[ApiService],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.css'
})
export class CreateProjectComponent implements OnInit{
 
  selectedIcon: string = '';
  projectForm!: FormGroup;
  projectName!: String;
  reasonList: Reason[] = [];
  typesList: Types[] = [];
  divList: Division[] = [];
  categoryList: Category[] = [];
  priorityList: Priority[] = [];
  departmentList: Department[] = [];
  locationList: Location[] = [];
  startDate: Date | null = null;
  endDate: Date | null = null;
  status: string = "Registered";
  selectedUsers: number[] | null = null; 
  status1: string = "1";


  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) { }

  saveRecord(e: { target: { value: any; }; }) {
    console.log(e.target.value)
  }

  ngOnInit(): void {
   
    this.initializeForm();
    this.getReasons();
    this.getTypes();
    this.getDivision();
    this.getCategory();
    this.getPriority();
    this.getDepartment();
    this.getLocation();
    
  }

  initializeForm(): void {
    this.projectForm = this.fb.group({
      projectName: ['', Validators.required],
      reason: ['', Validators.required],
      types: ['', Validators.required],
      division: ['', Validators.required],
      category: ['', Validators.required],
      priority: ['', Validators.required],
      department: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required,],
      location: ['', Validators.required]
    });
  }


  getReasons(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.apiService.getRequest("Project/Reason", { headers }).subscribe(data => {
      this.reasonList = data;
    }
    );
  }

  getTypes(): void {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.apiService.getRequest("Project/Types", { headers }).subscribe(data => {
      this.typesList = data;

    });
  }

  getDivision(): void {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.apiService.getRequest("Project/Division", { headers }).subscribe(data => {
      this.divList = data;
    });
  }

  getCategory(): void {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.apiService.getRequest("Project/Category", { headers }).subscribe(data => {
      this.categoryList = data;
    });
  }

  getPriority(): void {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.apiService.getRequest("Project/Priority", { headers }).subscribe(data => {
      this.priorityList = data;
    });
  }

  getDepartment(): void {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.apiService.getRequest("Project/Department", { headers }).subscribe(data => {
      this.departmentList = data;
    });
  }

  getLocation(): void {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.apiService.getRequest("Project/Location", { headers }).subscribe(data => {
      this.locationList = data;
    });
  }


  saveProject(): void {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    if (this.projectForm.valid) {
      const projectData = this.projectForm.value;

      console.log("ProjectData---",projectData)
      projectData.reasonId = this.projectForm.get('reason')?.value;
      projectData.typeId = this.projectForm.get('types')?.value;
      projectData.divisionId = this.projectForm.get('division')?.value;
      projectData.categoryId = this.projectForm.get('category')?.value;
      projectData.priorityId = this.projectForm.get('priority')?.value;
      projectData.departmentId = this.projectForm.get('department')?.value;
      projectData.locationId = this.projectForm.get('location')?.value;
      projectData.statusId = this.status1;
      projectData.startDate = this.projectForm.get('startDate')?.value;
      projectData.endDate = this.projectForm.get('endDate')?.value;

    delete projectData.reason;
    delete projectData.types;
    delete projectData.division;
    delete projectData.category;
    delete projectData.priority;
    delete projectData.department;
    delete projectData.location;

      this.apiService.postRequest("Project/AddProject", projectData, { headers } ).subscribe(response => {
         console.log('Project saved:', projectData, response);
        this.projectForm.reset();
        this.router.navigate(['/projectlist']);
      });
    } else {
     
    }
  }

  getReasonObject(reasonId: number): Reason | null {
    return this.reasonList.find(reason => reason.reasonId == reasonId) || null;
  }

  getTypeObject(typeId: number): Types | null {
    return this.typesList.find(types => types.typeId == typeId) || null;
  }

  getDivisionObject(divisionId: number): Division | null {
    return this.divList.find(division => division.divisionId == divisionId) || null;
  }

  getCategoryObject(categoryId: number): Category | null {
    return this.categoryList.find(category => category.categoryId == categoryId) || null;
  }

  getPriorityObject(priorityId: number): Priority | null {
    return this.priorityList.find(priority => priority.priorityId == priorityId) || null;
  }

  getDepartmentObject(departmentId: number): Department | null {
    return this.departmentList.find(department => department.departmentId == departmentId) || null;
  }

  getLocationObject(locationId: number): Location | null {
    return this.locationList.find(location => location.locationId == locationId) || null;
  }

  error: any = { isError: false, errorMessage: '' };

  compareTwoDates() {
    const startDate = new Date(this.projectForm.controls['startDate'].value);
    const endDate = new Date(this.projectForm.controls['endDate'].value);
    if (endDate < startDate) {
      this.error = { isError: true, errorMessage: "End Date can't be before Start Date" };
    } else {
      this.error = { isError: false, errorMessage: '' };
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
      this.router.navigate(['/login']);
    }
  }

}