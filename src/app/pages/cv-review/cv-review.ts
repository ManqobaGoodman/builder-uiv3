import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef } from '@angular/core';
import html2pdf from 'html2pdf.js';


@Component({
  selector: 'app-cv-review',
  standalone: true,
  imports: [CommonModule], // ✅ THIS FIXES ngIf + ngFor
  templateUrl: './cv-review.html',
  styleUrl: './cv-review.css',
})
export class CvReview {
  cvData: any;
   @ViewChild('cvContainer') cvContainer!: ElementRef;

  ngOnInit() {
    this.cvData = history.state.cvData;
  }

async downloadPDF() {
  if (typeof window === 'undefined') return;

  const element = this.cvContainer.nativeElement;

  // ❌ Hide buttons
  const buttons = element.querySelector('.no-export') as HTMLElement;
  if (buttons) buttons.style.display = 'none';

  const html2pdf = (await import('html2pdf.js')).default;

  await html2pdf().from(element).save('cv.pdf');

  // ✅ Show buttons again
  if (buttons) buttons.style.display = 'block';
}


downloadWord() {
  const element = this.cvContainer.nativeElement.cloneNode(true) as HTMLElement;

  // ❌ Remove buttons (Download PDF / Word)
  const buttons = element.querySelectorAll('button');
  buttons.forEach(btn => btn.remove());

  // ❌ Remove Angular attributes (_ngcontent-*)
  element.querySelectorAll('*').forEach(el => {
    [...el.attributes].forEach(attr => {
      if (attr.name.startsWith('_ngcontent')) {
        el.removeAttribute(attr.name);
      }
    });
  });

  // ❌ Remove Angular comments (<!--container-->)
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_COMMENT, null);
  let node;
  while (node = walker.nextNode()) {
    node.parentNode?.removeChild(node);
  }

  // ✅ Clean HTML
  const cleanHTML = element.innerHTML;

  // ✅ Wrap in proper Word document format
  const html = `
    <html>
      <head>
        <meta charset="utf-8">
        <title>CV</title>
      </head>
      <body>
        ${cleanHTML}
      </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', html], {
    type: 'application/msword'
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'cv.doc';
  link.click();

  URL.revokeObjectURL(url);
}

}
