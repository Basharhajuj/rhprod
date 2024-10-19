import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReelDetailsService } from '../service/reels-details.service'; 

@Component({
  selector: 'app-reels-details',
  templateUrl: './reels-details.component.html',
  styleUrls: ['./reels-details.component.scss']
})
export class ReelsDetailsComponent implements OnInit {
  category: string = '';
  videos: string[] = [];

  constructor(private route: ActivatedRoute, private reelDetailsService: ReelDetailsService) {}

  ngOnInit(): void {
    this.category = this.route.snapshot.paramMap.get('category') || '';
    this.fetchVideos(); // Fetch videos based on the category
  }

  fetchVideos(): void {
    this.reelDetailsService.getVideosByCategory(this.category).subscribe(
      (data: any) => {
        this.videos = data?.videos || [];
      },
      (error: any) => {
        console.error('Error fetching videos for category:', error);
      }
    );
  }
}