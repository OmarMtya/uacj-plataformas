import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesarrolloInstitucionalComponent } from './desarrollo-institucional.component';

describe('DesarrolloInstitucionalComponent', () => {
  let component: DesarrolloInstitucionalComponent;
  let fixture: ComponentFixture<DesarrolloInstitucionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesarrolloInstitucionalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesarrolloInstitucionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
