import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  userForm: FormGroup;
  profilePics: string[] = [];
  currentUser: User | null = null;
  userId: number | null = null;
  showPassword: boolean = false;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      dob: ['', Validators.required],
      address: this.fb.group({
        houseNo: ['', Validators.required],
        street: ['', Validators.required],
        landmark: ['', Validators.required],
        state: ['', Validators.required],
        country: ['', Validators.required],
        pincode: ['', Validators.required]
      }),
      profilePic: [''],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.userId = parseInt(this.route.snapshot.paramMap.get('id') ?? '0', 10);
    if (this.userId) {
      this.loadUserData();
    }
    this.loadProfilePics();
  }

  loadUserData(): void {
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe(
        user => {
          console.log('Loaded user:', user);
          this.currentUser = user;
          this.userForm.patchValue({
            name: user.name || '',
            email: user.email || '',
            password: user.password || '',
            phoneNumber: user.phoneNumber || '',
            dob: user.dob || '',
            address: user.address || {
              houseNo: '',
              street: '',
              landmark: '',
              state: '',
              country: '',
              pincode: ''
            },
            profilePic: user.profilePic || '',
            description: user.description || ''
          });
        },
        error => {
          console.error('Error loading user data:', error);
        }
      );
    }
  }

  loadProfilePics(): void {
    this.profilePics = [
      'profile1.png',
      'profile2.png',
      'profile3.png'
    ];
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  uploadProfilePic(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('profilePic', this.selectedFile, this.selectedFile.name);

        this.http.post<{ filePath: string }>('http://localhost:3000/uploadProfilePic', formData).subscribe(
          response => {
            resolve(response.filePath);
          },
          error => {
            console.error('Error uploading file:', error);
            reject(error);
          }
        );
      } else {
        resolve(this.userForm.value.profilePic);
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.userForm.valid && this.currentUser) {
      let profilePicPath: string;
      try {
        profilePicPath = await this.uploadProfilePic();
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        return;
      }

      const updatedUser: User = {
        ...this.currentUser,
        ...this.userForm.value,
        profilePic: profilePicPath
      };

      console.log('Updating user with data:', updatedUser);

      this.userService.updateUserProfile(updatedUser._id, updatedUser).subscribe(
        response => {
          console.log('User updated successfully:', response);
          this.router.navigate([`/view-profile/${updatedUser._id}`]);
        },
        error => {
          console.error('Error updating user:', error);
        }
      );
    }
  }

  viewProfile() {
    if (this.userId) {
      this.router.navigate([`/view-profile/${this.userId}`]);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
