import { Component, OnInit } from '@angular/core';
import { ReelService } from '../service/reels.service';

@Component({
  selector: 'app-reels',
  templateUrl: './reels.component.html',
  styleUrls: ['./reels.component.scss']
})
export class ReelsComponent implements OnInit {
  categories: any[] = []; // Fetch categories dynamically from backend

  constructor(private reelService: ReelService) {
    console.log('ReelsComponent Constructor: Initialized');
  }

  ngOnInit(): void {
    console.log('ngOnInit: Component Initialization');
    this.fetchReels(); // Fetch reels from backend on component init
  }

  fetchReels(): void {
    console.log('Fetching reels from backend...');
    this.reelService.getReels().subscribe((data: any[]) => {
      this.categories = data;
      console.log('Fetched categories:', this.categories);
    });
  }
}
