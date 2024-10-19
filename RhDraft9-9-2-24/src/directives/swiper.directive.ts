import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import type  SwiperOptions  from 'swiper';
import { register } from 'swiper/element/bundle';

register();

@Directive({
  selector: '[swiperElement]'
})
export class SwiperDirective implements AfterViewInit {
  @Input('config') config?: SwiperOptions;
  private readonly swiperElement: HTMLElement;

  constructor(private element: ElementRef<HTMLElement>) {
    this.swiperElement = element.nativeElement;
  }

  ngAfterViewInit(): void {
    Object.assign(this.swiperElement, this.config);
    //@ts-ignore
    this.swiperElement.initialize();
  }
}
