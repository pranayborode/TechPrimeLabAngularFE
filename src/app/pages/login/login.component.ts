import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterOutlet,RouterLink,ReactiveFormsModule,HttpClientModule],
  providers:[ApiService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  loginForm!: FormGroup;
  isFormSubmitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService:ApiService
  ){}



  ngOnInit(): void {
      this.loginForm = this.fb.group({
        email:['',[Validators.required,Validators.email]],
        password:['',Validators.required]
      });
  }

  onSubmit(): void {
    this.isFormSubmitted = true;
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.apiService.login(email, password).subscribe(
        (response: any) => { 
          localStorage.setItem('token', response.token); 
          this.router.navigate(['/dashboard']);
        },
        (error: any) => {
          console.log(error);
          if (error.status === 404) {
            alert("User not found");
          } else if (error.status === 401) {
            alert("Incorrect password...");
           
          } else {
            alert("Invalid Credentials");
           
          }
        }
      );
    }
  }
}