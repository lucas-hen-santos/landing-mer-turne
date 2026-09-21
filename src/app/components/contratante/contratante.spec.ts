import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Contratante } from './contratante';

describe('Contratante', () => {
  let component: Contratante;
  let fixture: ComponentFixture<Contratante>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Contratante],
    }).compileComponents();

    fixture = TestBed.createComponent(Contratante);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
