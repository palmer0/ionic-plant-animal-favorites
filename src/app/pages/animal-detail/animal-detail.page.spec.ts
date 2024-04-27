import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnimalDetailPage } from './animal-detail.page';

describe('AnimalDetailPage', () => {
  let component: AnimalDetailPage;
  let fixture: ComponentFixture<AnimalDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AnimalDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
