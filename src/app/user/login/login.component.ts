import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  inSubmission = false
  showAlert = false
  alertMessage = 'Please wait! Your account is being created'
  alertColor = 'blue'

  credentials = { 
     email: '',
     password: ''
  }
  constructor(private auth : AngularFireAuth){}
  ngOnInit(): void {
    
  }

  async login() {
    this.showAlert = true
    this.alertMessage = 'Please wait! Your account is being created'
    this.alertColor = 'blue'  
    this.inSubmission = true

    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email,
        this.credentials.password
      ) 
    } catch (error) {
      console.error(error)
      this.alertMessage = 'An unexpected error occured. Please try again later'
      this.alertColor = 'red'
      this.inSubmission = false
      return        
    }

    this.alertMessage = 'Success! Your account has been created'
    this.alertColor = 'green'

  }

}
