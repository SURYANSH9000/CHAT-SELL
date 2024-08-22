import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage-service.service'; 

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit {
  user!: User;
  userId!: number;
  loggedUserId!: number;
  isOwnProfile: boolean = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.loggedUserId = +this.localStorageService.getItem('userId')!;
    this.route.params.subscribe(params => {
      this.userId = +params['id'];
      if (this.userId) {
        this.userService.getUserById(this.userId).subscribe(user => {
          this.user = user;
          console.log('User:', this.user);
          this.isOwnProfile = this.userId === this.loggedUserId; // Check if the profile belongs to the logged-in user
        }, error => {
          console.error('Error fetching user details:', error);
        });
      }
    });
  }

  editProfile(): void {
    if (this.userId) {
      this.router.navigate([`/edit-profile/${this.userId}`]);
    }
  }
}
