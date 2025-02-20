import { Component } from '@angular/core';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { FormHeaderComponent } from './components/form-header/form-header.component';
import { FormFooterComponent } from './components/form-footer/form-footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [SignupFormComponent , FormHeaderComponent ,FormFooterComponent]
})
export class AppComponent {}


