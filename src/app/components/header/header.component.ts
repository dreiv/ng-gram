import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from 'firebase/app';
import { Observable, EMPTY } from 'rxjs';
import { take, catchError } from 'rxjs/operators';

import { AuthService } from '../../services/auth/auth.service';
import { BASE } from '../../constants/routes.const';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  user$: Observable<User | null> = this.auth.user$;

  constructor(
    private readonly auth: AuthService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
  ) { }

  login(): void {
    this.auth
      .loginViaGoogle()
      .pipe(
        take(1),
        catchError((error) => {
          this.snackBar.open(`${error.message} 😢`, 'Close', {
            duration: 4000,
          });
          return EMPTY;
        }),
      )
      .subscribe(
        (response) =>
          response &&
          this.snackBar.open(
            `Oh! You're here. I demand that you feed me, Hooman. 😾`,
            'Close',
            {
              duration: 4000,
            },
          ),
      );
  }

  logout(): void {
    this.auth
      .logout()
      .pipe(take(1))
      .subscribe((response) => {
        this.router.navigate([`/${BASE}`]);
        this.snackBar.open('Come back soon with treats! 😿', 'Close', {
          duration: 4000,
        });
      });
  }

}
