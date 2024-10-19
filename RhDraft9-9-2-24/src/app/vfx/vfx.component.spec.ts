import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VfxComponent } from './vfx.component';

describe('VfxComponent', () => {
  let component: VfxComponent;
  let fixture: ComponentFixture<VfxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VfxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VfxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
