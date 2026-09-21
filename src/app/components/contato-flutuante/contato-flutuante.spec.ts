import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContatoFlutuante } from './contato-flutuante';

describe('ContatoFlutuante', () => {
  let component: ContatoFlutuante;
  let fixture: ComponentFixture<ContatoFlutuante>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContatoFlutuante],
    }).compileComponents();

    fixture = TestBed.createComponent(ContatoFlutuante);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
