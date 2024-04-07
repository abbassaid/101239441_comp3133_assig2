import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UsersService } from '../gql/user.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
})

export class SignupComponent {
  signupForm!: FormGroup;
  constructor(private usersService: UsersService, private router:Router) {}
  ngOnInit(): void {
    this.signupForm = new FormGroup({
      username: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl(''),
      passwordConfirm: new FormControl('')
    });
  }
  signup() {
      if (this.signupForm.valid) {
        this.usersService.signUp(this.signupForm.value.username, this.signupForm.value.email, this.signupForm.value.password).pipe(
          catchError(error => {
            const gqlError = error.graphQLErrors?.[0]?.message || "Failed to Signup try again later.";
            console.error("Error signing up:", error);
            return of({ message: gqlError, user: null });
          })
        ).subscribe((response: any) => {
          if (response && response.user) {
            alert(response.message);
            this.signupForm.reset();
            this.router.navigate(['/login']);
            localStorage.setItem('user', JSON.stringify(response.user));
          } else {
            console.log("Signup failed:", response.message);
            alert(response.message || "Signup failed. Please enter correct credentials.");
          }
        });
    }
  }
}