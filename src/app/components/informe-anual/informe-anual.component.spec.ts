import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeAnualComponent } from './informe-anual.component';

describe('InformeAnualComponent', () => {
  let component: InformeAnualComponent;
  let fixture: ComponentFixture<InformeAnualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformeAnualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeAnualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
