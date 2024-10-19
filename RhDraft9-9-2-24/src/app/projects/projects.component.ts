import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Project {
  title: string;
  imageUrl: string;
  link: string; // Link to the detailed project page
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [
    {
      title: 'Alirio Cosmetics',
      imageUrl: 'assets/setup.JPG',
      link: '/projects/alirio-cosmetics'
    },
    {
      title: 'Gelato Boutique',
      imageUrl: 'assets/setup1.JPG',
      link: '/projects/gelato-boutique'
    },
    {
      title: 'Al-Mahran',
      imageUrl: 'assets/setup2.JPG',
      link: '/projects/al-mahran'
    },
    // Add more projects as needed
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigateToProject(link: string): void {
    this.router.navigateByUrl(link);
  }
}
