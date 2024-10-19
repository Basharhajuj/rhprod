import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VfxAdminComponent } from './vfx-admin.component';

describe('VfxAdminComponent', () => {
  let component: VfxAdminComponent;
  let fixture: ComponentFixture<VfxAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VfxAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VfxAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
