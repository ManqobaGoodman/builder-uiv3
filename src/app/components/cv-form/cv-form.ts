import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cv-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cv-form.html',
  styleUrl: './cv-form.css',
})
export class CvForm {
  // cv-form.component.ts
  @Input() cvData: any;
  @Input() step = 0;

  minDate = '1980-01';
  maxDate = new Date().toISOString().slice(0, 7);

  formatMonthYear(value: string) {
    if (!value) {
      return '';
    }
    const [year, month] = value.split('-');
    if (!year || !month) {
      return value;
    }
    return `${month}/${year}`;
  }

  parseMonthYear(value: string) {
    if (!value) {
      return '';
    }
    const cleaned = value.trim().replace(/\s+/g, '');
    const parts = cleaned.includes('/') ? cleaned.split('/') : cleaned.split('-');
    if (parts.length !== 2) {
      return '';
    }
    let [month, year] = parts;
    if (year.length === 2) {
      year = `20${year}`;
    }
    if (month.length === 1) {
      month = `0${month}`;
    }
    if (!/^(0[1-9]|1[0-2])$/.test(month) || !/^\d{4}$/.test(year)) {
      return '';
    }
    return `${year}-${month}`;
  }

  addExperience() {
    if (!this.cvData.experience) {
      this.cvData.experience = [];
    }
    this.cvData.experience.push({
      title: '',
      company: '',
      startDate: '',
      endDate: ''
    });
  }

  addEducation() {
    if (!this.cvData.education) {
      this.cvData.education = [];
    }
    this.cvData.education.push({
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: ''
    });
  }

  deleteEducation(index: number) {
    if (!this.cvData.education) {
      return;
    }
    this.cvData.education.splice(index, 1);
  }

  deleteExperience(index: number) {
    if (!this.cvData.experience) {
      return;
    }
    this.cvData.experience.splice(index, 1);
  }
}
