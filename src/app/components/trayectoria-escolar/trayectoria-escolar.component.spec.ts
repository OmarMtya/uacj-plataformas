import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrayectoriaEscolarComponent } from './trayectoria-escolar.component';

describe('TrayectoriaEscolarComponent', () => {
  let component: TrayectoriaEscolarComponent;
  let fixture: ComponentFixture<TrayectoriaEscolarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrayectoriaEscolarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrayectoriaEscolarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
