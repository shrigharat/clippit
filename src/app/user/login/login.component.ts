import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  loading = false;
  alertTitle: string = "";
  alertSubtitle: string = "";
  alertColor: string = "";
  showAlert: boolean = false;

  constructor(public auth: AngularFireAuth) {}

  ngOnInit(): void {}

  async submitLogin() {
    const { email, password } = this.loginForm.value;
    console.log('Login creds: ', { email, password });
    this.loading = true;
    try {
      await this.auth.signInWithEmailAndPassword(email!, password!);
      this.loading = false;
      this.alertTitle = "Login successful!";
      this.alertSubtitle = "Redirecting...";
      this.alertColor = "rgba(58, 240, 61)";
      this.showAlert = true;
    } catch (e) {
      this.loading = false;
      this.alertTitle = "An error occured!";
      this.alertSubtitle = "Please try again.";
      this.alertColor = "rgba(219, 38, 22)";
      this.showAlert = true;
      console.error(e);
    }
  }
}
