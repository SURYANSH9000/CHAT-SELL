import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { LocalStorageService } from '../../../services/local-storage-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  onSubmitLogin(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.userService.login(email, password).subscribe(
        response => {
          if (response.token && response.userId) {
            this.localStorageService.setItem('token', response.token);
            this.localStorageService.setItem('userId', response.userId.toString());
            console.log('Logged in successfully');
            this.router.navigate(['/home']);
            this.toastr.success('Logged in successfully');
            window.location.reload();
          } else {
            this.displayErrorMessage('Incorrect email or password.');
          }
        },
        error => {
          this.displayErrorMessage('Incorrect email or password.');
          console.error('Error logging in:', error);
        }
      );
    } else {
      this.displayErrorMessage('Please fill out all required fields correctly.');
      console.warn('Login form is invalid');
      this.markFormFieldsAsTouched();
    }
  }

  private displayErrorMessage(message: string): void {
    this.loginError = message;
  }

  private markFormFieldsAsTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  onBlur(fieldName: string): void {
    const control = this.loginForm.get(fieldName);
    control?.markAsTouched();
    control?.updateValueAndValidity(); // Update the validity
  }
}
