import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvForm } from '../../components/cv-form/cv-form';
import { AiService } from '../../services/ai';
import { Router } from '@angular/router';

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
    skills: [],
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

  jobDescription = '';

  useJobDescription = false;

  constructor(private aiservice: AiService, private router: Router) { }

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

  const payload = this.formatCvToText(this.cvData);
  // ✅ Clean job description — remove bullets, dots, extra whitespace
const cleanJobDescription = this.useJobDescription
  ? this.jobDescription
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .replace(/▪/g, '')              // remove bullet symbols
      .replace(/•/g, '')              // remove bullet dots
      .replace(/^\s*[\-\*]\s*/gm, '') // remove dash/star bullets
      .replace(/\n/g, ' ')            // ✅ remove newlines — join into single line
      .replace(/\s{2,}/g, ' ')        // remove multiple spaces
      .trim()
  : '';

  this.aiservice.generateCV(payload, cleanJobDescription).subscribe({
    next: (response: any) => {
      let cleanText = '';
      if (response?.content?.length > 0) {
        cleanText = response.content[0].text;
      } else {
        cleanText = JSON.stringify(response);
      }

      // ✅ Clean AI response
      cleanText = cleanText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      let parsedCv;
      try {
        parsedCv = JSON.parse(cleanText);
      } catch (e) {
        console.error('JSON parse error', e);
        alert('Invalid response from AI');
        return;
      }

      this.router.navigate(['/review'], {
        state: { cvData: parsedCv }
      });
    },
    error: (error) => {
      console.error('Error submitting CV', error);
      alert('There was an error submitting your CV.');
    }
  });
}

  formatCvToText(data: any): string {
    const cv = data.text || data; // ✅ handles both cases

    return `
${cv?.name || ''} ${cv?.email || ''} | ${cv?.phone || ''} | ${cv?.location || ''},

Profile
${cv?.summary || ''}

Skills
${Array.isArray(cv?.skills) ? cv.skills.join(', ') : cv?.skills || ''}

Education
${(cv?.education || []).map((e: any) =>
      `${e.startDate || ''} - ${e.endDate || ''}, ${e.degree || ''} in ${e.field || ''}, ${e.school || ''}`
    ).join(' ')}

Work Experience
${(cv?.experience || []).map((exp: any) =>
      `${exp.startDate || ''} - ${exp.endDate || ''}, ${exp.title || ''}, ${exp.company || ''}. ${exp.description || ''}`
    ).join(' ')}
`
      .replace(/\r?\n|\r/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

}