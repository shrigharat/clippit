import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import IUser from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { EmailTaken } from '../validators/email-taken';
import { RegisterValidators } from '../validators/register-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  loading: boolean = false;
  alertTitle: string = "";
  alertSubtitle: string = "";
  alertColor: string = "";
  showAlert: boolean = false;

  registerForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl(
        '',
        [Validators.required, Validators.email],
        [this.emailTaken.validate]
      ),
      age: new FormControl(0, [Validators.required, Validators.min(18)]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm
        ),
      ]),
      confirmPassword: new FormControl('', [Validators.required, ]),
      phoneNumber: new FormControl('', [Validators.required]),
    },
    [RegisterValidators.match('password', 'confirmPassword')]
  );

  constructor(private auth: AuthService, private emailTaken: EmailTaken) {}

  async submitForm() {
    this.loading = true;
    try {
      const userData: IUser = {
        name: this.registerForm.value.name!,
        age: this.registerForm.value.age!,
        phoneNumber: this.registerForm.value.phoneNumber!,
        email: this.registerForm.value.email!,
        password: this.registerForm.value.password!,
      };
      await this.auth.registerUser(userData);
      this.loading = false;
      this.showAlert = true;
      this.alertColor = "rgba(58, 240, 61)";
      this.alertTitle = "Sign up successful!";
      this.alertSubtitle = "You will now be redirected to the app.";
    } catch (e) {
      this.loading = false;
      alert('Could not register user. Please try again!');
      console.error(e);
      this.showAlert = true;
      this.alertColor = "rgba(219, 38, 22)";
      this.alertTitle = "Could not create your account!";
      this.alertSubtitle = "Please try again.";
    }
  }
}
