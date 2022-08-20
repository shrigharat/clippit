import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import {
  ActivatedRoute,
  ActivationEnd,
  NavigationEnd,
  Router,
  RouterEvent,
} from '@angular/router';
import { delay, filter, map, Observable, of, pluck, switchMap } from 'rxjs';
import IUser from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>;
  public isAuthenticated: Observable<boolean>;
  redirect = false;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    public route: ActivatedRoute
  ) {
    this.usersCollection = db.collection('users');
    this.isAuthenticated = auth.user.pipe(map((user) => !!user), delay(1000));

    this.router.events
      .pipe(
        filter((r) => r instanceof NavigationEnd),
        map(() => this.route.firstChild),
        switchMap((route) => route?.data ?? of({}))
      )
      .subscribe((data) => {
        this.redirect = data['authOnly'] || false;
      });
  }

  public async registerUser(formValues: IUser) {
    if (!formValues.password)
      throw new Error('Password is required to register a user');

    const { email, password } = formValues;

    const userCreds = await this.auth.createUserWithEmailAndPassword(
      email,
      password
    );
    if (!userCreds.user) throw new Error('Could not find user');
    await this.usersCollection.doc(userCreds.user.uid).set({
      name: formValues.name,
      phoneNumber: formValues.phoneNumber,
      age: formValues.age,
      email: formValues.email,
    });
    await userCreds.user.updateProfile({ displayName: formValues.name });
    console.log('User registration successfull...');
    // console.log(userCreds);
  }

  async logout(e: Event) {
    if (e) {
      e.preventDefault();
    }
    await this.auth.signOut();
    if (this.redirect) {
      await this.router.navigateByUrl('/');
    }
  }
}
