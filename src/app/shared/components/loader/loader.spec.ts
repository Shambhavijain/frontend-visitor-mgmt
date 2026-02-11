import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Loader } from './loader';
import { By } from '@angular/platform-browser';

describe('Loader Component', () => {
  let fixture: ComponentFixture<Loader>;
  let component: Loader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Loader]
    }).compileComponents();

    fixture = TestBed.createComponent(Loader);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have isLoading false by default', () => {
    expect(component.isLoading).toBeFalse();
  });

  it('should show loader in DOM when isLoading is true', () => {
    component.isLoading = true;
    fixture.detectChanges();

    const loaderElement = fixture.debugElement.query(By.css('.loader'));
    expect(loaderElement).toBeTruthy();
  });

  it('should hide loader in DOM when isLoading is false', () => {
    component.isLoading = false;
    fixture.detectChanges();

    const loaderElement = fixture.debugElement.query(By.css('.loader'));
    expect(loaderElement).toBeNull();
  });
});
