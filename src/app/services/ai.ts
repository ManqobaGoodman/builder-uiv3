import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AiService {

  private apiUrl = 'http://localhost:8080/api/ai/analyze';

  constructor(private http: HttpClient) {}

  generateCV(text: string) {
    return this.http.post<any>(this.apiUrl, {
      text: text   // ✅ MUST match backend
    });
  }
}