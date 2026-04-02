import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat-input.html',
  styleUrl: './chat-input.css',
})
export class ChatInput {
  // chat-input.component.ts
  @Output() generate = new EventEmitter<string>();
  inputText = '';

  @ViewChild('chatContainer') chatContainer!: ElementRef;

scrollToBottom() {
  setTimeout(() => {
    this.chatContainer.nativeElement.scrollTop =
      this.chatContainer.nativeElement.scrollHeight;
  });
}

  onGenerate() {
    this.generate.emit(this.inputText);
    this.scrollToBottom();
  }
}
