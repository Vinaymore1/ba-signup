import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-signup-form',
  standalone: true,
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatStepperModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class SignupFormComponent implements OnInit {
  accountDetails!: FormGroup;
  personalDetails!: FormGroup;
  organizationDetails!: FormGroup;
  credentials!: FormGroup;
  passwordStrength = 0;

  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  capabilities = ['APIM', 'Data Management', 'DS & AI', 'DAD', 'Client Success'];
  locations = ['Pune','Bangalore', 'USA', 'Australia', 'Hyderabad'];
  titles = ['Analyst','Consultant','Sr.Consultant','Manager','Director','Sr.Director','Intern'];

  constructor(private fb: FormBuilder) {
    this.initForms();
  }

  ngOnInit(): void {
    this.setupPasswordStrengthMeter();
  }

  private initForms(): void {
    this.accountDetails = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        this.validateBlueAltairEmail
      ]],
      firstName: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z\s]*$/),
        Validators.minLength(2)
      ]],
      lastName: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z\s]*$/),
        Validators.minLength(2)
      ]],
      employeeId: ['', [
        Validators.required,
        Validators.pattern(/^BA\d{4}$/)
      ]],
      title: ['', Validators.required],
      mobileNo: ['', [
        Validators.required,
        Validators.pattern(/^[6-9]\d{9}$/)
      ]]
    });

    this.personalDetails = this.fb.group({
      gender: ['', Validators.required],
      bloodGroup: ['', Validators.required],
      dob: ['', [
        Validators.required,
        this.validateAge
      ]],
      placeOfBirth: ['', Validators.required],
      emergencyContactName: ['', Validators.required],
      emergencyContactNumber: ['', [
        Validators.required,
        Validators.pattern(/^[6-9]\d{9}$/)
      ]]
    });

    this.organizationDetails = this.fb.group({
      capability: ['', Validators.required],
      baseLocation: ['', Validators.required],
      careerManager: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z\s]*$/)
      ]]
    });

    this.credentials = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.validatePasswordStrength.bind(this)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  private setupPasswordStrengthMeter(): void {
    const passwordControl = this.credentials.get('password');
    if (passwordControl) {
      passwordControl.valueChanges.subscribe(
        password => {
          this.passwordStrength = this.calculatePasswordStrength(password);
        }
      );
    }
  }

  private calculatePasswordStrength(password: string): number {
    let strength = 0;
    if (password) {
      if (password.length >= 8) strength += 20;
      if (password.match(/[A-Z]/)) strength += 20;
      if (password.match(/[a-z]/)) strength += 20;
      if (password.match(/[0-9]/)) strength += 20;
      if (password.match(/[^A-Za-z0-9]/)) strength += 20;
    }
    return strength;
  }

  private validateAge(control: AbstractControl): { [key: string]: any } | null {
    if (!control.value) return null;
    const dob = new Date(control.value);
    const age = new Date().getFullYear() - dob.getFullYear();
    return age >= 18 && age <= 60 ? null : { invalidAge: true };
  }

  private validateBlueAltairEmail(control: AbstractControl): { [key: string]: any } | null {
    const email = control.value;
    return email && email.endsWith('@bluealtair.com') ? null : { invalidEmail: true };
  }

  private validatePasswordStrength(control: AbstractControl): { [key: string]: any } | null {
    const password = control.value;
    const strength = this.calculatePasswordStrength(password);
    return strength >= 60 ? null : { weakPassword: true };
  }

  passwordMatchValidator(group: AbstractControl): { [key: string]: any } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  getErrorMessage(controlPath: string): string {
    const [formName, controlName] = controlPath.split('.');
    let control: AbstractControl | null = null;
    
    switch(formName) {
      case 'accountDetails':
        control = this.accountDetails.get(controlName);
        break;
      case 'personalDetails':
        control = this.personalDetails.get(controlName);
        break;
      case 'organizationDetails':
        control = this.organizationDetails.get(controlName);
        break;
      case 'credentials':
        control = this.credentials.get(controlName);
        break;
    }

    if (!control?.errors) return '';

    const errors = control.errors;
    if (errors['required']) return 'This field is required';
    if (errors['email']) return 'Invalid email format';
    if (errors['invalidEmail']) return 'Must be a BlueAltair email address';
    if (errors['pattern']) {
      if (controlName === 'mobileNo' || controlName === 'emergencyContactNumber') 
        return 'Invalid mobile number';
      if (controlName === 'employeeId') 
        return 'Invalid Employee ID format (BAxxxx)';
      return 'Invalid format';
    }
    if (errors['minlength']) return 'Minimum length not met';
    if (errors['invalidAge']) return 'Age must be between 18 and 60';
    if (errors['weakPassword']) return 'Password not strong enough';
    if (errors['mismatch']) return 'Passwords do not match';

    return 'Invalid input';
  }

  getPasswordStrengthColor(): string {
    if (this.passwordStrength <= 40) return 'red';
    if (this.passwordStrength <= 80) return 'orange';
    return 'green';
  }

  submitForm(): void {
    if (this.accountDetails.valid && 
        this.personalDetails.valid && 
        this.organizationDetails.valid && 
        this.credentials.valid) {
      const formData = {
        accountDetails: this.accountDetails.value,
        personalDetails: this.personalDetails.value,
        organizationDetails: this.organizationDetails.value,
        credentials: this.credentials.value
      };
      console.log('Form submitted:', formData);
      localStorage.setItem('signupData', JSON.stringify(formData));
      alert('Signup successful! Redirecting...');
      window.location.href = '/dashboard';
    } else {
      alert('Please fill all required fields correctly.');
    }
  }
}