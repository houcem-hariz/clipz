import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";

// Injectable is added in order to inject the service into the constructor
@Injectable({
    providedIn: 'root'
})
export class EmailTaken implements AsyncValidator{
    constructor(private auth : AngularFireAuth) {

    }
    validate = async (control: AbstractControl): Promise<ValidationErrors | null> => {
        const response = await this.auth.fetchSignInMethodsForEmail(control.value);
        console.log(response);
        
        return response.length ? { emailTaken: true } : null;
    }
}
