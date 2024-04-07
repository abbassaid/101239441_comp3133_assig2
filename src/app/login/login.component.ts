import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UsersService } from '../gql/user.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { UserResponse } from '../interfaces/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private usersService: UsersService, private router: Router) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.loginForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl(''),
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.usersService.login(this.loginForm.value.username, this.loginForm.value.password)
          .pipe(
              catchError(error => {
                const gqlError = error.graphQLErrors?.[0]?.message || "Failed to login due to server error.";
                console.error("Error logging in:", error);
                return of({ message: gqlError, user: null });
              })
          ).subscribe((response: UserResponse) => {
        if (response && response.user) {
          console.log("Login successful:", response.message);
          this.handleSuccess(response);
        } else {
          console.log("Login failed:", response.message);
          this.handleFailure(response.message || "Login failed. Please check your username and password and try again.");
        }
      });
    }
  }

  handleSuccess(response: UserResponse): void {
    this.loginForm.reset();
    this.router.navigate(['/employees']);
    localStorage.setItem('user', JSON.stringify(response.user));
  }

  handleFailure(message: string): void {
    alert(message);
  }
}
