import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { DrawPage } from './draw-page';
import { EntrantsService } from './entrants.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should prompt for an import when there are no entrants', async () => {
    const fixture = TestBed.createComponent(DrawPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('A little suspense.');
    expect(compiled.querySelector('.empty-draw')?.textContent).toContain('No entries yet');
    expect(compiled.querySelector('.pick-button')?.hasAttribute('disabled')).toBe(true);
    expect(compiled.querySelector('a[routerlink="/import"]')).toBeTruthy();
  });

  it('should not spotlight the first entrant before the draw starts', () => {
    TestBed.inject(EntrantsService).replace([
      { username: 'mila', avatar: '', color: '#e7c8b3' },
      { username: 'noah', avatar: '', color: '#c9d2e0' },
    ]);

    const fixture = TestBed.createComponent(DrawPage);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.empty-draw')?.textContent).toContain('Ready for the draw');
    expect(compiled.querySelector('.spotlight-name')).toBeNull();
    expect(compiled.querySelector('.selected-entrant')).toBeNull();
  });
});
