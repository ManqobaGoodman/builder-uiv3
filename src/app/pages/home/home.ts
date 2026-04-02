import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvForm } from '../../components/cv-form/cv-form';
import { AiService } from '../../services/ai';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports: [CommonModule, CvForm]
})
export class Home {

  step = 0;
  stepLabels = ['Personal Info', 'About', 'Skills', 'Education', 'Experience', 'Review'];
  personalInfoError = '';
  cvData: any = {
    name: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    skills: '',
    education: [{
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      description: ''
    }],
    experience: [{
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      description: ''
    }]
  };

  constructor(private aiservice: AiService) {}

  prevStep() {
    if (this.step > 0) {
      this.step -= 1;
    }
  }

  nextStep() {
    if (this.step === 0 && !this.validatePersonalInfo()) {
      return;
    }

    if (this.step < this.stepLabels.length - 1) {
      this.step += 1;
    }
  }

  setStep(index: number) {
    if (index >= 0 && index < this.stepLabels.length) {
      this.step = index;
    }
  }

  validatePersonalInfo(): boolean {
    const name = this.cvData.name?.trim() || '';
    const email = this.cvData.email?.trim() || '';
    const phone = this.cvData.phone?.trim() || '';

    if (!name || !email || !phone) {
      this.personalInfoError = 'Please fill in all personal information fields.';
      this.setStep(0);
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      this.personalInfoError = 'Please enter a valid email address.';
      this.setStep(0);
      return false;
    }

    const phonePattern = /^[0-9+()\-\s]*$/;
    if (!phonePattern.test(phone)) {
      this.personalInfoError = 'Please enter a valid phone number.';
      this.setStep(0);
      return false;
    }

    this.personalInfoError = '';
    return true;
  }

  submitForm() {
    if (!this.validatePersonalInfo()) {
      return;
    }
    // Placeholder submit action: add your save/send logic here.
    console.log('CV submitted', this.cvData);

    this.aiservice.generateCV(JSON.stringify(this.cvData)).subscribe({
      next: (response) => {
        console.log('CV submitted successfully', response);
        alert('Your CV form has been submitted successfully!');
      },
      error: (error) => {
        console.error('Error submitting CV', error);
        alert('There was an error submitting your CV. Please try again.');
      }
    });
  }
}