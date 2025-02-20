import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(), // Required for Material animations
    importProvidersFrom(
      MatStepperModule, 
      MatInputModule, 
      MatButtonModule, 
      MatFormFieldModule, 
      MatSelectModule, 
      ReactiveFormsModule
    )
  ]
}).catch(err => console.error(err));
