import { Component, OnInit } from '@angular/core';
import { VfxAdminService } from '../service/vfx-admin.service';

@Component({
  selector: 'app-vfx-admin',
  templateUrl: './vfx-admin.component.html',
  styleUrls: ['./vfx-admin.component.scss']
})
export class VfxAdminComponent implements OnInit {
  title: string = '';
  videoFile: File | null = null;
  posterFile: File | null = null;
  vfxItems: any[] = [];

  constructor(private vfxAdminService: VfxAdminService) {}

  ngOnInit(): void {
    this.getVfxVideos(); // Fetch existing videos when the component loads
  }

  // Set the selected video or poster file
  onVideoSelected(event: any, fileType: string): void {
    if (fileType === 'video') {
      this.videoFile = event.target.files[0];
    } else if (fileType === 'poster') {
      this.posterFile = event.target.files[0];
    }
  }

  // Add a video entry
  addVideo(): void {
    if (this.videoFile && this.posterFile) {
      this.vfxAdminService.addVideo(this.title, this.videoFile, this.posterFile).subscribe(
        (event) => {
          if (event.status === 'progress') {
            console.log(`Upload Progress: ${event.message}`);
          } else if (event.status === 'unknown') {
            console.error('Unexpected event:', event);
          } else {
            alert('Video added successfully!');
            this.title = '';
            this.videoFile = null;
            this.posterFile = null; // Reset form fields
            this.getVfxVideos(); // Refresh the list after adding a new video
          }
        },
        (error) => {
          console.error('Error adding video:', error);
          alert('Error adding video. Please try again.');
        }
      );
    } else {
      alert('Please select both video and poster files.');
    }
  }

  // Fetch videos from the backend
  getVfxVideos(): void {
    this.vfxAdminService.getVideos().subscribe(
      (data: any[]) => {
        this.vfxItems = data;
      },
      (error) => {
        console.error('Error fetching videos:', error);
        alert('Failed to fetch videos. Please try again later.');
      }
    );
  }

  // Delete a video entry
  deleteVideo(id: string): void {
    if (!id) {
      alert('Invalid ID provided for deletion.');
      console.error('Invalid ID provided');
      return;
    }

    this.vfxAdminService.deleteVideo(id).subscribe(
      (response) => {
        alert('Video deleted successfully!');
        this.getVfxVideos(); // Refresh the list after deletion
      },
      (error) => {
        console.error('Error deleting video:', error);
        alert('Failed to delete video. Please check if the video ID is correct or try again later.');
      }
    );
  }
}
