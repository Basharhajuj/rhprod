import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isSidebarVisible: boolean = false;
  isWhiteNavbar: boolean = false; 
  private firstSectionOffsetTop: number = 0;
  private secondSectionOffsetTop: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const whiteRoutes = ['/reels','/vfx', '/projects', '/about', '/admin/reels', '/admin/vfx'];
        
        this.isWhiteNavbar = whiteRoutes.some(route => event.url.startsWith(route));
      }
    });

    // Get the offsetTop positions for sections
    const firstSection = document.getElementById('section1');
    const secondSection = document.getElementById('projects-carousel');
    
    if (firstSection && secondSection) {
      this.firstSectionOffsetTop = firstSection.offsetTop;
      this.secondSectionOffsetTop = secondSection.offsetTop;
    }
  }

  // Listen to scroll events to switch navbar styles
  @HostListener('window:scroll', [])
onWindowScroll() {
  const section1 = document.getElementById('section1');
  const section2 = document.getElementById('projects-carousel');

  // Ensure both sections are defined
  if (section1 && section2) {
    const section1Rect = section1.getBoundingClientRect();
    const section2Rect = section2.getBoundingClientRect();

    // Condition to switch to white navbar when section 2 is visible (partially or fully in view)
    if (section2Rect.top <= 0) {
      this.isWhiteNavbar = true;
    } 
    // Condition to revert back to default navbar when section 1 is in view
    else if (section1Rect.bottom > 0) {
      this.isWhiteNavbar = false;
    }
  }
}


  toggleSidebar() {
    const sidebarItems = document.querySelectorAll('.sidebar ul li');
    
    if (this.isSidebarVisible) {
      // If closing, apply the reverse animation
      sidebarItems.forEach((item) => {
        item.classList.add('hidden');
      });
      
      // Delay the actual closing of the sidebar until the reverse animation finishes
      setTimeout(() => {
        this.isSidebarVisible = false;
      }, 1000);
    } else {
      // If opening, remove the reverse animation class
      sidebarItems.forEach((item) => {
        item.classList.remove('hidden');
      });
      
      this.isSidebarVisible = true;
    }
    
    const menu = document.querySelector('.menu');
    if (menu) {
      menu.classList.toggle('opened');
    }
  }
}
