import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import IUser  from '../models/user.model'
import { Observable, delay, map, filter, switchMap, of } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userCollection : AngularFirestoreCollection<IUser>
  public isAuthenticated$ : Observable<boolean>
  public isAuthenticatedWithDelay$ : Observable<boolean>
  public redirect = false

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute  
    ) { 
      this.userCollection = this.db.collection('users')
      this.isAuthenticated$ = auth.user.pipe(
        map(user =>  !!user)
      )

      this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(
        delay(1000)
      )

      this.router.events.pipe(
        filter(e => e instanceof NavigationEnd),
        map(e => this.route.firstChild),
        switchMap(route => route?.data ?? of({ authOnly: false }))
      ).subscribe((data)=> { 
        this.redirect = data.authOnly ?? false
      })
    }

  public async createUser(userData: IUser) {
    if (!userData.password) {
      throw new Error('Password not provided!')
    }

    const userCredentials = await this.auth.createUserWithEmailAndPassword(
      userData.email, userData.password
    )
    
    if(!userCredentials.user) {
      throw new Error('User cannot be found')
    }
    await this.userCollection.doc(userCredentials.user.uid).set({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber
    })

    await userCredentials.user.updateProfile({
      displayName: userData.name
    })
  }

  public async logout($event?: Event){
    if ($event) {
      $event.preventDefault()
    }
    await this.auth.signOut()
    if (this.redirect) {
      await this.router.navigateByUrl('/')
    }
  }
}
