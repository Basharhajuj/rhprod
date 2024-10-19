import { Component, OnInit } from '@angular/core';
import { VfxAdminService } from '../service/vfx-admin.service';

@Component({
  selector: 'app-vfx',
  templateUrl: './vfx.component.html',
  styleUrls: ['./vfx.component.scss']
})
export class VfxComponent implements OnInit {
  vfxItems: any[] = [];

  constructor(private vfxAdminService: VfxAdminService) {}

  ngOnInit(): void {
    this.getVfxVideos();
  }

  // Fetch videos from the backend
  getVfxVideos(): void {
    this.vfxAdminService.getVideos().subscribe(
      (data: any[]) => {
        this.vfxItems = data;
      },
      (error) => {
        console.error('Error fetching videos:', error);
      }
    );
  }
}
