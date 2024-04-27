import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnimalListPage } from './animal-list.page';

describe('AnimalListPage', () => {
  let component: AnimalListPage;
  let fixture: ComponentFixture<AnimalListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AnimalListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
