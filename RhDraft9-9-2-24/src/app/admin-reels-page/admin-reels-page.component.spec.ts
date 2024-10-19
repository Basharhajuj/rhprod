import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReelsPageComponent } from './admin-reels-page.component';

describe('AdminReelsPageComponent', () => {
  let component: AdminReelsPageComponent;
  let fixture: ComponentFixture<AdminReelsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminReelsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminReelsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
