import { Component, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [MatCardModule,CommonModule,MatFormFieldModule,FormsModule,ReactiveFormsModule,MatInputModule,MatButtonModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(): void {
    const { username, password } = this.loginForm.value;

    if (username === 'developer@gmail.com' && password === 'admin') {
      localStorage.setItem('isLoggedIn', 'true'); // Guardar sesión
      this.router.navigate(['/letrasdecambio']); // Redirigir a la página principal
    } else {
      this.errorMessage = 'Usuario o contraseña incorrectos';
    }
  }
}
