import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { LocalStorageService } from '../../../services/local-storage-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  registerError: string | null = null;
  passwordVisible = false;
  confirmPasswordVisible = false;
  maxDate: string = this.calculateMaxDate();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      dob: ['', [Validators.required, this.ageValidator]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      address: this.fb.group({
        houseNo: ['', Validators.required],
        street: ['', Validators.required],
        landmark: ['', Validators.required],
        state: ['', Validators.required],
        country: ['', Validators.required],
        pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
      })
    }, { validator: this.passwordMatchValidator });
    
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.registerForm.get('confirmPassword')?.updateValueAndValidity();
    });

    this.registerForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.registerForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {}

  calculateMaxDate(): string {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 14, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0];
  }

  ageValidator(control: any) {
    const dob = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear(); // Use `let` here
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age >= 14 ? null : { ageRequirement: true };
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmitRegister(): void {
    if (this.registerForm.valid) {
      const { confirmPassword, ...formValue } = this.registerForm.value; // Exclude confirmPassword
  
      this.userService.register(formValue).subscribe(
        response => {
          const user = response.user || response;
          const { token } = response;
  
          if (user && token) {
            this.localStorageService.setItem('token', token);
            this.localStorageService.setItem('userId', user.id.toString());
            this.toastr.success('User Registered successfully');
            this.router.navigate(['/']);
            window.location.reload();
          } else {
            this.displayErrorMessage('Registration failed. Please try again.');
          }
        },
        error => {
          // Handle specific error messages
          if (error.message.includes('Email is already in use')) {
            this.displayErrorMessage('Email is already in use. Please choose another email.');
          } else {
            this.displayErrorMessage('Registration failed. Please try again.');
          }
          console.error('Error registering user:', error);
        }
      );
    } else {
      this.displayErrorMessage('Please fill out all required fields correctly.');
      this.markFormFieldsAsTouched();
    }
  }
  

  private displayErrorMessage(message: string): void {
    this.registerError = message;
  }

  private markFormFieldsAsTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach(innerKey => {
          const innerControl = control.get(innerKey);
          innerControl?.markAsTouched();
        });
      } else {
        control?.markAsTouched();
      }
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  onBlur(fieldName: string): void {
    const control = this.registerForm.get(fieldName);
    control?.markAsTouched();
    control?.updateValueAndValidity();
  
    if (fieldName === 'confirmPassword' && control?.valid) {
      this.checkPasswordMatch();
    }
  }
  
  checkPasswordMatch(): void {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
  
    if (password !== confirmPassword && confirmPassword.length >= 6) {
      this.registerForm.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      this.registerForm.get('confirmPassword')?.setErrors(null);
    }
  }
  
}
