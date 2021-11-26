import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuiaElaboracionComponent } from './guia-elaboracion.component';

describe('GuiaElaboracionComponent', () => {
  let component: GuiaElaboracionComponent;
  let fixture: ComponentFixture<GuiaElaboracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuiaElaboracionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuiaElaboracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
