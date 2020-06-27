import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User, auth } from 'firebase/app';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: BehaviorSubject<Observable<User | null>>;

  user$ = this.user
    .asObservable()
    .pipe(switchMap((user: Observable<User | null>) => user));

  constructor(private afAuth: AngularFireAuth) {
    this.user = new BehaviorSubject<Observable<User | null>>(
      this.afAuth.authState
    );
  }

  loginViaGoogle(): Observable<auth.UserCredential> {
    return from(this.afAuth.signInWithPopup(new auth.GoogleAuthProvider()));
  }

  logout(): Observable<void> {
    return from(this.afAuth.signOut());
  }
}
