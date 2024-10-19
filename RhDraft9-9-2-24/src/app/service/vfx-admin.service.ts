import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class VfxAdminService {
  private apiUrl = 'http://localhost:5000/api/vfx'; // Backend API URL

  constructor(private http: HttpClient) {}

  // Add a new VFX video using FormData
  addVideo(title: string, videoFile: File, posterFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('video', videoFile);
    formData.append('poster', posterFile);


    return this.http.post<any>(this.apiUrl, formData, {
      reportProgress: true,
      observe: 'events',
    }).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            if (event.total) {
              const progress = Math.round((100 * event.loaded) / event.total);
              return { status: 'progress', message: `${progress}%` };
            }
            break;
          case HttpEventType.Response:
            return event.body;
          default:
            return { status: 'unknown', message: 'Unhandled event' };
        }
      })
    );
  }

  // Fetch all VFX videos
  getVideos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Delete a VFX video
  deleteVideo(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
