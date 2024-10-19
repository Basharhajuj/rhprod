import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReelDetailsService {
  private apiUrl = 'http://localhost:5000/api/reels-details';  // Backend endpoint

  constructor(private http: HttpClient) {}

  // Get videos by category
  getVideosByCategory(category: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${category}`);
  }

  // Add new video to a category
  addVideoToCategory(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }

  // Delete a video from a category
  deleteVideoFromCategory(category: string, videoUrl: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${category}`, { body: { video: videoUrl } });
  }
}
