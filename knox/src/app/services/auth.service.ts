import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User | null | undefined>;
  user: User = { uid: '', email: '', displayName: '', photoURL: '' };

  constructor(
    private router: Router,
    private afa: AngularFireAuth,
    private afs: AngularFirestore
  ) {
    this.user$ = this.afa.authState.pipe(
      switchMap((user) => {
        if (user) {
          this.user = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
          };
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async googleSignin() {
    var provider = new firebase.auth.GoogleAuthProvider();
    let credential = await this.afa.signInWithPopup(provider);
    await this.updateUserData(credential.user);
    this.router.navigate(['/home']);
  }

  async updateUserData(user: any) {
    let userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );
    let data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };

    return userRef.set(data, { merge: true });
  }

  async signout() {
    await this.afa.signOut();
    return this.router.navigate(['/']);
  }
}
