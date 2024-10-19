import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReelService } from '../service/reels.service';
import { ReelDetailsService } from '../service/reels-details.service';

interface ReelCategory {
  name: string;
  reel: Reel | null;
  title: string;
  description: string;
  background: string;
  video: string;
  poster: string;
  editing: boolean;
  detailsVideos: string[];
}

interface Reel {
  _id: string;
  title: string;
  description: string;
  background: string;
  video: string;
  poster: string;
  category: string;
}

@Component({
  selector: 'app-admin-reels-page',
  templateUrl: './admin-reels-page.component.html',
  styleUrls: ['./admin-reels-page.component.scss']
})
export class AdminReelsPageComponent implements OnInit {
  categories: ReelCategory[] = [
    { name: 'products', reel: null, title: '', description: '', background: '', video: '', poster: '', editing: false, detailsVideos: [] },
    { name: 'feedback', reel: null, title: '', description: '', background: '', video: '', poster: '', editing: false, detailsVideos: [] },
    { name: 'general environment', reel: null, title: '', description: '', background: '', video: '', poster: '', editing: false, detailsVideos: [] },
    { name: 'educational', reel: null, title: '', description: '', background: '', video: '', poster: '', editing: false, detailsVideos: [] },
    { name: 'service', reel: null, title: '', description: '', background: '', video: '', poster: '', editing: false, detailsVideos: [] }
  ];

  isManagingDetails = false;
  currentCategory: ReelCategory | null = null;
  newVideo: File | null = null;

  reels: any[] = [];
  newReel: any = {
    _id: '',
    title: '',
    description: '',
    background: '',
    video: null as File | string | null,
    poster: null as File | string | null,
    category: ''
  };
  isEditing = false;
  isAdding = false;

  constructor(private reelService: ReelService, private reelDetailsService: ReelDetailsService) {}

  ngOnInit() {
    this.fetchReels();
  }

  openManageDetailsModal(category: ReelCategory): void {
    this.isManagingDetails = true;
    this.currentCategory = category;

    // Fetch existing details for this category
    this.reelDetailsService.getVideosByCategory(category.name).subscribe(
      (data: any) => {
        if (this.currentCategory) {
          this.currentCategory.detailsVideos = data.videos || [];
        }
      },
      (error: any) => {
        console.error('Error fetching reel details:', error);
      }
    );
  }

  // Close the manage details modal
  closeManageDetailsModal(): void {
    this.isManagingDetails = false;
    this.currentCategory = null;
  }

  // Handle file input change for adding a new video
  onNewVideoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.newVideo = input.files[0];
    }
  }

  // Add a new video detail
  addVideoDetail(): void {
    if (!this.newVideo || !this.currentCategory) {
      return;
    }

    // Send video to backend to handle Cloudinary upload
    const formData = new FormData();
    formData.append('category', this.currentCategory.name);
    formData.append('video', this.newVideo);

    this.reelDetailsService.addVideoToCategory(formData).subscribe(
      (response: any) => {
        if (response.secure_url) {
          this.currentCategory?.detailsVideos.push(response.secure_url);
          this.newVideo = null;
          alert('Video added successfully!');
        }
      },
      (error: any) => {
        console.error('Error adding video detail:', error);
      }
    );
  }

  // Delete an existing video detail
  deleteVideoDetail(index: number): void {
    if (!this.currentCategory || index < 0 || index >= this.currentCategory.detailsVideos.length) {
      return;
    }

    const videoToDelete = this.currentCategory.detailsVideos[index];
    this.reelDetailsService.deleteVideoFromCategory(this.currentCategory.name, videoToDelete).subscribe(
      () => {
        this.currentCategory?.detailsVideos.splice(index, 1);
      },
      (error: any) => {
        console.error('Error deleting video detail:', error);
      }
    );
  }

  // Fetch saved reels from the backend
  fetchReels() {
    this.reelService.getReels().subscribe(
      (reels: any[]) => {
        this.reels = reels;
        console.log('Reels fetched successfully:', this.reels);

        // Map fetched reels to the appropriate category
        this.categories.forEach(category => {
          const reel = this.reels.find(r => r.category === category.name);
          if (reel) {
            category.reel = reel;
          }
        });
      },
      (error: any) => {
        console.error('Error fetching reels:', error);
      }
    );
  }

  // Open modal to add a new reel
  openAddReelModal(category: any): void {
    this.isAdding = true;
    this.newReel.category = category.name;
  }

  // Open modal to edit an existing reel
  openEditModal(category: any): void {
    console.log('Editing reel:', category.reel);

    if (!category.reel) {
      console.error('Category is missing a reel. Check the category object:', category);
      return;
    }

    this.newReel = { ...category.reel }; // Load the reel into form, including category
    this.isEditing = true;
  }

  // Close the add modal
  closeAddReelModal(): void {
    this.resetForm();
    this.isAdding = false;
  }

  // Close the edit modal
  closeEditModal(): void {
    this.resetForm();
    this.isEditing = false;
  }

  // Handle file input change for video
  onVideoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      console.log('Video file selected:', input.files[0]);
      this.newReel.video = input.files[0];
    }
  }

  // Handle file input change for poster
  onPosterSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      console.log('Poster file selected:', input.files[0]);
      this.newReel.poster = input.files[0];
    }
  }

  // Add a new reel
  addReel(): void {
    console.log('Adding new reel:', this.newReel);
    const reelData = this.prepareFormData();

    this.reelService.addReel(reelData).subscribe(
      (response) => {
        console.log('Reel added successfully:', response);
        alert('Reel added successfully!');
        this.fetchReels();
        this.closeAddReelModal();
      },
      (error) => {
        console.error('Error adding reel:', error);
      }
    );
  }

  // Update an existing reel
  updateReel(): void {
    console.log('Updating reel:', this.newReel);

    if (!this.newReel.category) {
      console.error('Category is not set for the reel. Update operation aborted.');
      return;
    }

    const reelData = this.prepareFormData();

    this.reelService.updateReel(this.newReel.category, reelData).subscribe(
      (response) => {
        console.log('Reel updated successfully:', response);
        this.fetchReels();
        this.closeEditModal();
      },
      (error) => {
        console.error('Error updating reel:', error);
      }
    );
  }

  // Delete a reel
  deleteReel(category: string): void {
    console.log('Deleting reel with category:', category); // Check the category being passed
    this.reelService.deleteReel(category).subscribe(
      () => {
        console.log('Reel deleted successfully.');
        this.fetchReels();
      },
      (error) => {
        console.error('Error deleting reel:', error);
      }
    );
  }

  // Reset the form
  resetForm(): void {
    console.log('Resetting the form...');
    this.newReel = {
      _id: '',
      title: '',
      description: '',
      background: '',
      video: null,
      poster: null,
      category: ''
    };
  }

  // Prepare form data for the reel (used in add/update operations)
  private prepareFormData(): FormData {
    const reelData = new FormData();
    reelData.append('title', this.newReel.title);
    reelData.append('description', this.newReel.description);
    reelData.append('background', this.newReel.background);

    if (this.newReel.video instanceof File) {
      reelData.append('video', this.newReel.video);
    }

    if (this.newReel.poster instanceof File) {
      reelData.append('poster', this.newReel.poster);
    }

    reelData.append('category', this.newReel.category);
    return reelData;
  }
}