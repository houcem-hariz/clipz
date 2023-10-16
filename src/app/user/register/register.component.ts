import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service'
import IUser from 'src/app/models/user.model';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  inSubmission = false
  showAlert = false
  alertMessage = 'Please wait! Your account is being created'
  alertColor = 'blue'
  
  constructor(
    private auth : AuthService,
    private emailTaken: EmailTaken) {}
  
  registerForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),

    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ], [this.emailTaken.validate]),
    age: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(18),
      Validators.max(120)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$')
    ]),
    confirm_password: new FormControl('', [
      Validators.required,
      Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$')
    ]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10)
    ])
  }, [RegisterValidators.match('password', 'confirm_password')])

  async register() {
    this.showAlert = true
    this.alertMessage = 'Please wait! Your account is being created'
    this.alertColor = 'blue'  
    this.inSubmission = true
    try {
        this.auth.createUser(this.registerForm.value as IUser)
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
