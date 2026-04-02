import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiService } from '../../services/ai';
import { CvForm } from '../../components/cv-form/cv-form';
import { CvPreview } from '../../components/cv-preview/cv-preview';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, CvForm, CvPreview],
  templateUrl: './editor.html',
  styleUrls: ['./editor.css'],
})
export class Editor {
  // editor.component.ts
  @Input() cvData: any;
  loading = false;

  constructor(private aiService: AiService) {}

ngOnInit() {
  const input = (typeof history !== 'undefined' && history.state)
    ? history.state.input
    : null;

  if (!input) {
    this.loading = false;
    return;
  }

  this.aiService.generateCV(input).subscribe(res => {
    this.cvData = res;
    this.loading = false;
  });
}
}
