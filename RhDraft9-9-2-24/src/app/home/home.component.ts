import { Component, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import Swiper from 'swiper';
import { SwiperOptions } from 'swiper/types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('swiperProjects') swiperProjectsRef!: ElementRef;
  @ViewChild('swiperRef') swiperRef!: ElementRef;
  public projectsConfig: SwiperOptions = {
    slidesPerView: 1,  // One slide per view for projects
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  };
  // Swiper configuration
  public teamConfig: SwiperOptions = {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    loop: true,
    spaceBetween: 20,
    coverflowEffect: {
      rotate: 0,
      stretch: 50,
      depth: 100,
      modifier: 0.6,
      slideShadows: true,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      1024: { slidesPerView: 3, spaceBetween: 30 },
      768: { slidesPerView: 2, spaceBetween: 20 },
      0: { slidesPerView: 1, spaceBetween: 10 }
    }
  };

  sections: HTMLElement[] = [];
  currentSectionIndex = 0;

  ngAfterViewInit(): void {
    if (this.swiperProjectsRef) {
      new Swiper(this.swiperProjectsRef.nativeElement, this.projectsConfig);
    }

    if (this.swiperRef) {
      new Swiper(this.swiperRef.nativeElement, this.teamConfig);
    }
    this.sections = Array.from(document.querySelectorAll('section'));
  }

  // Listen for wheel event to trigger scroll
  @HostListener('window:wheel', ['$event'])
  onWindowScroll(event: WheelEvent) {
    if (event.deltaY > 0 && this.currentSectionIndex < this.sections.length - 1) {
      this.currentSectionIndex++;
    } else if (event.deltaY < 0 && this.currentSectionIndex > 0) {
      this.currentSectionIndex--;
    }
    this.scrollToSection(this.currentSectionIndex);
  }

  // Scroll to the specific section based on index
  scrollToSection(index: number): void {
    const sectionTop = this.sections[index].offsetTop;
    window.scrollTo({ top: sectionTop, behavior: 'smooth' });
  }
}
